const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { transpile } = require('./transpiler');

const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node run.js <file.absurd>");
  process.exit(1);
}

if (!filePath.endsWith('.absurd')) {
  console.error("Error: Provided file must have a .absurd extension.");
  process.exit(1);
}

const resolvedPath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: File not found at ${resolvedPath}`);
  process.exit(1);
}

const sourceCode = fs.readFileSync(resolvedPath, 'utf8');

try {
  const generatedCode = transpile(sourceCode);

  console.log("========================================");
  console.log(" ABSURD-JS TRANSPILATION");
  console.log("========================================");
  console.log(generatedCode);
  console.log("========================================");
  console.log(" EXECUTION");
  console.log("========================================");

  vm.runInNewContext(generatedCode, { console });

  console.log("========================================");
  console.log(" EXECUTION COMPLETE");
  console.log("========================================");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
