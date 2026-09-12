const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { transpile, transpileToAbsurd } = require('../transpiler');

const PORT = process.env.PORT || 3002;
const PUBLIC_DIR = path.resolve(__dirname, '../frontend');

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  let cleanUrl = req.url.split('?')[0];
  let reqUrl = cleanUrl === '/' ? '/index.html' : cleanUrl;
  const filePath = path.join(PUBLIC_DIR, path.normalize(reqUrl));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not Found');
    }
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.json': 'application/json',
      '.png': 'image/png'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    });
    return res.end();
  }

  // API Endpoints
  if (req.method === 'POST' && req.url === '/api/transpile') {
    try {
      const { source } = await parseBody(req);
      if (typeof source !== 'string') {
        return sendJson(res, 400, { success: false, error: 'Invalid or missing "source" string in request body.' });
      }
      const code = transpile(source);
      return sendJson(res, 200, { success: true, code });
    } catch (err) {
      return sendJson(res, 200, { success: false, error: err.message });
    }
  }

  if (req.method === 'POST' && req.url === '/api/reverse-transpile') {
    try {
      const { source } = await parseBody(req);
      if (typeof source !== 'string') {
        return sendJson(res, 400, { success: false, error: 'Invalid or missing "source" string in request body.' });
      }
      const code = transpileToAbsurd(source);
      return sendJson(res, 200, { success: true, code });
    } catch (err) {
      return sendJson(res, 200, { success: false, error: err.message });
    }
  }

  if (req.method === 'POST' && req.url === '/api/run') {
    try {
      const { source, mode } = await parseBody(req);
      if (typeof source !== 'string') {
        return sendJson(res, 400, { success: false, error: 'Invalid or missing "source" string in request body.' });
      }

      let code;
      let convertedCode = null;

      if (mode === 'js-to-absurd') {
        // Source is JS, convert to Absurd first to show output
        convertedCode = transpileToAbsurd(source);
        // Then convert Absurd back to JS for execution
        code = transpile(convertedCode);
      } else {
        // Source is Absurd, transpile to JS
        code = transpile(source);
        convertedCode = code;
      }

      const output = [];

      const customConsole = {
        log: (...args) => {
          output.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        error: (...args) => {
          output.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        warn: (...args) => {
          output.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        },
        info: (...args) => {
          output.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
        }
      };

      const sandbox = {
        console: customConsole
      };

      vm.runInNewContext(code, sandbox, { timeout: 2000 });

      return sendJson(res, 200, {
        success: true,
        code: convertedCode,
        output
      });
    } catch (err) {
      return sendJson(res, 200, { success: false, error: err.message });
    }
  }

  // Static File Serving
  if (req.method === 'GET') {
    return serveStatic(req, res);
  }

  res.writeHead(405);
  res.end('Method Not Allowed');
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
