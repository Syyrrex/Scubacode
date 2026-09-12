const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const jsTokens = require('js-tokens');
const dictionary = require('./dictionary');

const PARSER_OPTIONS = {
  sourceType: 'module',
  allowReturnOutsideFunction: true,
  allowAwaitOutsideFunction: true,
  allowSuperOutsideMethod: true,
  allowImportExportEverywhere: true
};

/**
 * Transpiles Absurd-JS source code into valid modern JavaScript.
 * Uses token-aware normalization and Babel AST transformations.
 * Preserves string literals, template strings, and comments untouched.
 */
function transpile(sourceCode) {
  if (typeof sourceCode !== 'string') {
    throw new Error('Source code must be a string.');
  }

  // 1. Token-Aware Pre-Normalization (Preserves string literals & comments)
  const tokens = [];
  for (const match of sourceCode.matchAll(jsTokens.default || jsTokens)) {
    tokens.push(jsTokens.matchToToken(match));
  }

  let normalizedCode = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // String literals, template literals, and comments remain untouched
    if (token.type === 'string' || token.type === 'comment') {
      normalizedCode += token.value;
    } else if (token.type === 'name') {
      // Check if this token is a property access (e.g. object.propertyName)
      let prevNonWs = null;
      for (let j = i - 1; j >= 0; j--) {
        if (tokens[j].type !== 'whitespace') {
          prevNonWs = tokens[j];
          break;
        }
      }

      if (prevNonWs && prevNonWs.value === '.') {
        // Do not normalize member properties
        normalizedCode += token.value;
      } else if (Object.hasOwn(dictionary.keywords, token.value)) {
        normalizedCode += dictionary.keywords[token.value];
      } else {
        normalizedCode += token.value;
      }
    } else {
      normalizedCode += token.value;
    }
  }

  // 2. AST Parsing with Custom Error Interception
  let ast;
  try {
    ast = parser.parse(normalizedCode, PARSER_OPTIONS);
  } catch (err) {
    const randomRoast = dictionary.roasts[Math.floor(Math.random() * dictionary.roasts.length)];
    const line = err.loc ? err.loc.line : 'unknown';
    const column = err.loc ? err.loc.column : 'unknown';
    const errorMsg = `Vibe check failed: Invalid syntax encountered.\n\nLocation: line ${line}, column ${column}\n${randomRoast}\nOriginal error: ${err.message}`;
    const customErr = new Error(errorMsg);
    customErr.cause = err;
    throw customErr;
  }

  // 3. AST Traversal & Transformation
  traverse(ast, {
    CallExpression(path) {
      if (t.isIdentifier(path.node.callee, { name: 'spill' })) {
        path.node.callee = t.memberExpression(
          t.identifier('console'),
          t.identifier('log')
        );
      }
    }
  });

  // 4. Code Generation
  const output = generate(ast, {}, normalizedCode);
  return output.code;
}

/**
 * Reverse transpiles standard JavaScript code into canonical Absurd-JS.
 * Uses Babel AST to normalize JS and token-aware mapping to generate Absurd keywords.
 */
function transpileToAbsurd(jsCode) {
  if (typeof jsCode !== 'string') {
    throw new Error('JavaScript code must be a string.');
  }

  // 1. AST Parsing
  let ast;
  try {
    ast = parser.parse(jsCode, PARSER_OPTIONS);
  } catch (err) {
    const line = err.loc ? err.loc.line : 'unknown';
    const column = err.loc ? err.loc.column : 'unknown';
    throw new Error(`Invalid JavaScript syntax.\n\nLocation: line ${line}, column ${column}\nOriginal error: ${err.message}`);
  }

  // 2. AST Transformation for console.log(...) -> spill(...)
  traverse(ast, {
    CallExpression(path) {
      if (
        t.isMemberExpression(path.node.callee) &&
        t.isIdentifier(path.node.callee.object, { name: 'console' }) &&
        t.isIdentifier(path.node.callee.property, { name: 'log' })
      ) {
        path.node.callee = t.identifier('spill');
      }
    }
  });

  // 3. Code Generation from AST
  const normalizedJS = generate(ast, {}, jsCode).code;

  // 4. Token-Aware Reverse Mapping to Absurd Keywords & Operators
  const tokens = [];
  for (const match of normalizedJS.matchAll(jsTokens.default || jsTokens)) {
    tokens.push(jsTokens.matchToToken(match));
  }

  let absurdCode = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'string' || token.type === 'comment') {
      absurdCode += token.value;
    } else if (token.type === 'name') {
      // Check if property access
      let prevNonWs = null;
      for (let j = i - 1; j >= 0; j--) {
        if (tokens[j].type !== 'whitespace') {
          prevNonWs = tokens[j];
          break;
        }
      }

      if (prevNonWs && prevNonWs.value === '.') {
        absurdCode += token.value;
      } else if (Object.hasOwn(dictionary.jsToAbsurdKeywords, token.value)) {
        absurdCode += dictionary.jsToAbsurdKeywords[token.value];
      } else {
        absurdCode += token.value;
      }
    } else if (token.type === 'punctuator') {
      if (Object.hasOwn(dictionary.jsToAbsurdOperators, token.value)) {
        absurdCode += dictionary.jsToAbsurdOperators[token.value];
      } else {
        absurdCode += token.value;
      }
    } else {
      absurdCode += token.value;
    }
  }

  return absurdCode;
}

module.exports = { transpile, transpileToAbsurd };
