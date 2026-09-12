const assert = require('node:assert');
const vm = require('node:vm');
const { transpile, transpileToAbsurd } = require('./transpiler');

console.log("==========================================");
console.log("RUNNING SCUBACODE / ABSURD COMPILER TEST SUITE");
console.log("==========================================\n");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`✓ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`✕ [FAIL] ${name}`);
    console.error(`  Error: ${err.message}`);
  }
}

// 1. Variable Declarations
runTest("Variables (frfr, lowkey, Boomer)", () => {
  const absurd = "frfr a = 1; lowkey b = 2; Boomer c = 3;";
  const js = transpile(absurd);
  assert.match(js, /const a = 1;/);
  assert.match(js, /let b = 2;/);
  assert.match(js, /var c = 3;/);

  const backToAbsurd = transpileToAbsurd(js);
  assert.match(backToAbsurd, /frfr a = 1;/);
  assert.match(backToAbsurd, /lowkey b = 2;/);
  assert.match(backToAbsurd, /Boomer c = 3;/);
});

// 2. Control Flow (vibeCheck, otherwise, bet, forThePlot, Chopped, Glazing)
runTest("Control Flow (vibeCheck, otherwise, bet, forThePlot, Chopped, Glazing)", () => {
  const absurd = `
forThePlot (lowkey i = 0; i < 10; i++) {
  vibeCheck (i === 5) {
    Glazing;
  } otherwise vibeCheck (i === 8) {
    Chopped;
  }
}
lowkey count = 0;
bet (count < 3) {
  count++;
}
`;
  const js = transpile(absurd);
  assert.match(js, /for \(/);
  assert.match(js, /if \(/);
  assert.match(js, /continue;/);
  assert.match(js, /else if \(/);
  assert.match(js, /break;/);
  assert.match(js, /while \(/);

  const back = transpileToAbsurd(js);
  assert.match(back, /forThePlot/);
  assert.match(back, /vibeCheck/);
  assert.match(back, /Glazing/);
  assert.match(back, /Chopped/);
  assert.match(back, /bet/);
});

// 3. Operators (fanumtax, skibidi, Highkey, Ick, Tweakin, mogged, and, or, not)
runTest("Operators (fanumtax, skibidi, Highkey, Ick, Tweakin, mogged, and, or, not)", () => {
  const absurd = `
lowkey x = 10;
x fanumtax 5;
x skibidi 2;
vibeCheck (x Highkey 0 and x mogged 5 or x Ick 13 and not (x Tweakin 13)) {
  spill("Condition matched!");
}
`;
  const js = transpile(absurd);
  assert.match(js, /x \+= 5;/);
  assert.match(js, /x -= 2;/);
  assert.match(js, /x !== 0 && x > 5 \|\| x == 13 && !\(x != 13\)/);
  assert.match(js, /console\.log\("Condition matched!"\);/);

  const back = transpileToAbsurd(js);
  assert.match(back, /fanumtax/);
  assert.match(back, /skibidi/);
  assert.match(back, /Highkey/);
  assert.match(back, /mogged/);
  assert.match(back, /Ick/);
  assert.match(back, /Tweakin/);
  assert.match(back, /and/);
  assert.match(back, /or/);
  assert.match(back, /not/);
  assert.match(back, /spill/);
});

// 4. Literals & Identifiers (noCap, cap, nullVibe, undefinedVibe, BrainRot, Gyatt)
runTest("Literals & Values (noCap, cap, nullVibe, undefinedVibe, BrainRot, Gyatt)", () => {
  const absurd = `
frfr isReal = noCap;
frfr isFake = cap;
frfr empty = nullVibe;
frfr undef = undefinedVibe;
frfr notANum = BrainRot;
frfr inf = Gyatt;
`;
  const js = transpile(absurd);
  assert.match(js, /const isReal = true;/);
  assert.match(js, /const isFake = false;/);
  assert.match(js, /const empty = null;/);
  assert.match(js, /const undef = undefined;/);
  assert.match(js, /const notANum = NaN;/);
  assert.match(js, /const inf = Infinity;/);

  const back = transpileToAbsurd(js);
  assert.match(back, /noCap/);
  assert.match(back, /cap/);
  assert.match(back, /nullVibe/);
  assert.match(back, /undefinedVibe/);
  assert.match(back, /BrainRot/);
  assert.match(back, /Gyatt/);
});

// 5. Functions & Classes (deadass, itsGiving, Aura, GOAT, thisVibe, newVibe, Sus)
runTest("OOP & Functions (deadass, itsGiving, Aura, GOAT, thisVibe, newVibe, Sus)", () => {
  const absurd = `
Aura Person {
  constructor(name) {
    thisVibe.name = name;
  }
  getName() {
    itsGiving thisVibe.name;
  }
}

Aura Student extends Person {
  constructor(name, grade) {
    GOAT(name);
    thisVibe.grade = grade;
  }
}

deadass createStudent(name, grade) {
  frfr s = newVibe Student(name, grade);
  vibeCheck (s Sus Person) {
    itsGiving s;
  }
}
`;
  const js = transpile(absurd);
  assert.match(js, /class Person/);
  assert.match(js, /this\.name/);
  assert.match(js, /return this\.name/);
  assert.match(js, /class Student extends Person/);
  assert.match(js, /super\(name\)/);
  assert.match(js, /function createStudent/);
  assert.match(js, /new Student/);
  assert.match(js, /s instanceof Person/);

  const back = transpileToAbsurd(js);
  assert.match(back, /Aura Person/);
  assert.match(back, /thisVibe\.name/);
  assert.match(back, /itsGiving thisVibe\.name/);
  assert.match(back, /Aura Student extends Person/);
  assert.match(back, /GOAT\(name\)/);
  assert.match(back, /deadass createStudent/);
  assert.match(back, /newVibe Student/);
  assert.match(back, /s Sus Person/);
});

// 6. Error Handling & Async (Bruh, Cooked, ate, IYKYK, Ghost)
runTest("Exceptions, Async & Unary (Bruh, Cooked, ate, IYKYK, Ghost)", () => {
  const absurd = `
async deadass fetchData() {
  try {
    frfr res = ate fetch("/api");
    vibeCheck (IYKYK res === "undefined") {
      Bruh newVibe Error("Failed");
    }
  } catch (err) {
    spill(err);
  } Cooked {
    spill("Cleanup");
  }
}
frfr obj = { a: 1 };
Ghost obj.a;
`;
  const js = transpile(absurd);
  assert.match(js, /async function fetchData/);
  assert.match(js, /await fetch/);
  assert.match(js, /typeof res/);
  assert.match(js, /throw new Error/);
  assert.match(js, /finally \{/);
  assert.match(js, /delete obj\.a/);

  const back = transpileToAbsurd(js);
  assert.match(back, /deadass/);
  assert.match(back, /ate fetch/);
  assert.match(back, /IYKYK res/);
  assert.match(back, /Bruh newVibe Error/);
  assert.match(back, /Cooked \{/);
  assert.match(back, /Ghost obj\.a/);
});

// 7. Modules & Generators (Simp, Slay, Canon, Bussin)
runTest("Modules & Generators (Simp, Slay, Canon, Bussin)", () => {
  const absurd = `
Simp helper from './helper.js';
Slay frfr version = "1.0.0";
Slay Canon deadass* generator() {
  Bussin 1;
  Bussin 2;
}
`;
  const js = transpile(absurd);
  assert.match(js, /import helper from/);
  assert.match(js, /export const version/);
  assert.match(js, /export default function\*/);
  assert.match(js, /yield 1;/);

  const back = transpileToAbsurd(js);
  assert.match(back, /Simp helper from/);
  assert.match(back, /Slay frfr version/);
  assert.match(back, /Slay Canon deadass\*/);
  assert.match(back, /Bussin 1/);
});

// 8. String & Comment Safety (Never replace inside strings or comments)
runTest("String & Comment Literal Safety", () => {
  const absurd = `
// fanumtax Highkey skibidi Aura Boomer BrainRot Bruh Bussin Canon Chopped Cooked
// ate Ghost Glazing GOAT Gyatt Ick IYKYK Simp Slay Sus Tweakin mogged frfr lowkey
frfr message = "fanumtax Highkey skibidi Aura Boomer BrainRot Bruh Bussin Canon Chopped Cooked ate Ghost Glazing GOAT Gyatt Ick IYKYK Simp Slay Sus Tweakin mogged frfr lowkey vibeCheck otherwise noCap cap itsGiving deadass bet forThePlot";
`;
  const js = transpile(absurd);
  assert.match(js, /\/\/ fanumtax Highkey skibidi/);
  assert.match(js, /"fanumtax Highkey skibidi Aura Boomer BrainRot Bruh Bussin Canon Chopped Cooked ate Ghost Glazing GOAT Gyatt Ick IYKYK Simp Slay Sus Tweakin mogged frfr lowkey vibeCheck otherwise noCap cap itsGiving deadass bet forThePlot"/);

  const back = transpileToAbsurd(js);
  assert.match(back, /\/\/ fanumtax Highkey skibidi/);
  assert.match(back, /"fanumtax Highkey skibidi Aura Boomer BrainRot Bruh Bussin Canon Chopped Cooked ate Ghost Glazing GOAT Gyatt Ick IYKYK Simp Slay Sus Tweakin mogged frfr lowkey vibeCheck otherwise noCap cap itsGiving deadass bet forThePlot"/);
});

// 9. Period Keyword (Semicolon)
runTest("Period Keyword (Semicolon support for period and Period)", () => {
  const absurd = "frfr x = 10 period lowkey y = 20 Period";
  const js = transpile(absurd);
  assert.match(js, /const x = 10;\s*let y = 20;/);
});

// 10. Execution in Node.js VM Sandbox
runTest("Execution of Absurd Code with VM", () => {
  const code = `
deadass fib(n) {
  vibeCheck (n <= 1) {
    itsGiving n;
  }
  itsGiving fib(n - 1) + fib(n - 2);
}

lowkey total = 0;
forThePlot (lowkey i = 0; i < 6; i++) {
  total fanumtax fib(i);
}

spill("Fib total:", total);
`;
  const js = transpile(code);
  const output = [];
  const sandbox = {
    console: {
      log: (...args) => output.push(args.join(' '))
    }
  };
  vm.runInNewContext(js, sandbox, { timeout: 1000 });
  assert.strictEqual(output[0], "Fib total: 12");
});

console.log("\n==========================================");
console.log(`TEST RESULTS: ${passed} / ${total} PASSED`);
console.log("==========================================");

if (passed !== total) {
  process.exit(1);
}
