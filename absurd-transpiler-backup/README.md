# Absurd-JS AST Transpiler & Web IDE

A zero-cost, local CLI source-to-source compiler and web IDE for the custom **Absurd-JS** slang dialect (`.absurd`).

## Dialect Keywords

| Absurd Keyword | Target JavaScript | Stage |
| :--- | :--- | :--- |
| `frfr` | `const` | Pre-Lexer Normalization |
| `lowkey` | `let` | Pre-Lexer Normalization |
| `vibeCheck` | `if` | Pre-Lexer Normalization |
| `otherwise` | `else` | Pre-Lexer Normalization |
| `noCap` | `true` | Pre-Lexer Normalization |
| `cap` | `false` | Pre-Lexer Normalization |
| `itsGiving` | `return` | Pre-Lexer Normalization |
| `spill(...)` | `console.log(...)` | AST Transformation |

## Usage

### 1. Run Web Application
Start the backend server:
```bash
npm start
```
Open your browser and navigate to `http://localhost:3000`.

### 2. CLI Execution
Execute `.absurd` scripts directly from your terminal:
```bash
node run.js examples/logic.absurd
node run.js examples/fizzbuzz.absurd
```

Or run NPM test scripts:
```bash
npm run test:logic
npm run test:fizzbuzz
```
