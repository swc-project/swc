// Correct

// ParenthesizedExpression
const n = (0);
const s = ("");
const t = (``);
const b = (true);

// UnaryExpression
let unaryA = +12;
const unaryB = -1_2n;

// Incorrect

// UnaryExpression
const unaryC = +"str"
const unaryD = typeof "str"
const unaryE = {E: -"str"} as const
const unaryF = [+"str"] as const
