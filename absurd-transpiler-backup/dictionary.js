/**
 * Absurd-JS / Scubacode Central Slang Dictionary
 * Modular keyword and operator mapping definitions.
 */

const keywords = {
  // Existing keywords
  frfr: 'const',
  lowkey: 'let',
  vibeCheck: 'if',
  otherwise: 'else',
  noCap: 'true',
  cap: 'false',
  itsGiving: 'return',
  deadass: 'function',
  bet: 'while',
  forThePlot: 'for',
  and: '&&',
  or: '||',
  not: '!',
  nullVibe: 'null',
  undefinedVibe: 'undefined',
  newVibe: 'new',
  thisVibe: 'this',

  // New slang keywords
  Aura: 'class',
  Boomer: 'var',
  BrainRot: 'NaN',
  Bruh: 'throw',
  Bussin: 'yield',
  Canon: 'default',
  Chopped: 'break',
  Cooked: 'finally',
  ate: 'await',
  Ghost: 'delete',
  Glazing: 'continue',
  GOAT: 'super',
  Gyatt: 'Infinity',
  IYKYK: 'typeof',
  Simp: 'import',
  Slay: 'export',
  Sus: 'instanceof',
  fanumtax: '+=',
  skibidi: '-=',
  Highkey: '!==',
  Ick: '==',
  Tweakin: '!=',
  mogged: '>',
  Period: ';',
  period: ';'
};

const jsToAbsurdKeywords = {
  const: 'frfr',
  let: 'lowkey',
  var: 'Boomer',
  if: 'vibeCheck',
  else: 'otherwise',
  true: 'noCap',
  false: 'cap',
  return: 'itsGiving',
  function: 'deadass',
  while: 'bet',
  for: 'forThePlot',
  class: 'Aura',
  throw: 'Bruh',
  yield: 'Bussin',
  default: 'Canon',
  break: 'Chopped',
  finally: 'Cooked',
  await: 'ate',
  delete: 'Ghost',
  continue: 'Glazing',
  super: 'GOAT',
  Infinity: 'Gyatt',
  NaN: 'BrainRot',
  typeof: 'IYKYK',
  import: 'Simp',
  export: 'Slay',
  instanceof: 'Sus',
  null: 'nullVibe',
  undefined: 'undefinedVibe',
  new: 'newVibe',
  this: 'thisVibe'
};

const jsToAbsurdOperators = {
  '+=': 'fanumtax',
  '-=': 'skibidi',
  '!==': 'Highkey',
  '==': 'Ick',
  '!=': 'Tweakin',
  '>': 'mogged',
  '&&': 'and',
  '||': 'or',
  '!': 'not'
};

const roasts = [
  "Vibe check failed: Invalid syntax encountered.",
  "Skill issue detected on line: ",
  "The code is giving syntax error.",
  "Bro, even the parser rejected this.",
  "That's not valid JavaScript energy."
];

module.exports = {
  keywords,
  jsToAbsurdKeywords,
  jsToAbsurdOperators,
  roasts
};
