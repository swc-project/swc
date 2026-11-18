// A binding that may hold the global `RegExp` keeps the literal, because the
// call replaces its flags.
const R = RegExp;
export const constAlias = R(RegExp("(?-i:a)"), "i");
export const callMethod = RegExp.call(null, RegExp("(?-i:a)"), "i");
// An empty spread can come before the pattern.
export const leadingSpread = RegExp(...[], RegExp("(?-i:a)"), "i");
// The binding may hold another value at the call, so its string arguments are
// not rewritten.
let f = (s)=>s;
export function unused() {
    f = RegExp;
}
export const notRewritten = f("\\p{ASCII}", "u");
