# Scubacode

Scubacode is a fun JavaScript source-to-source transpiler that lets you write JavaScript using internet slang-inspired syntax.

It supports converting **Absurd syntax to JavaScript** and **JavaScript back to Absurd syntax**, with a web-based editor for writing, converting, and running code.

## Features

- Absurd → JavaScript transpilation
- JavaScript → Absurd reverse transpilation
- Babel AST-based transformations
- Run generated JavaScript in a sandbox
- Browser-based code editor
- Live output console
- Example programs
- Syntax error handling
- Slang-inspired JavaScript keywords
- No database or authentication required
- Runs locally with Node.js

## Tech Stack

- Node.js
- JavaScript
- HTML
- CSS
- Babel
  - `@babel/parser`
  - `@babel/traverse`
  - `@babel/generator`
  - `@babel/types`
- Node.js `vm` module for code execution

## Project Structure

```text
Scubacode/
├── backend/
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── examples/
│   ├── logic.absurd
│   └── fizzbuzz.absurd
├── dictionary.js
├── transpiler.js
├── reverse-transpiler.js

## Branches

- **`main`** (Render / Cloud Deployment)
  ```bash
  git checkout main
  npm install
  npm start
  ```

- **`localhost`** (Local Development)
  ```bash
  git checkout localhost
  cd absurd-transpiler
  npm install
  npm start
  ```

├── run.js
├── package.json
└── README.md
