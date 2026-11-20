// An empty spread can come before the pattern, so the literal is kept.
export const leadingSpread = RegExp(...[], /(?-i:a)/, "i");

// Aliases are not followed, so the string arguments of a binding that was
// assigned `RegExp` somewhere are not rewritten.
let f = (s) => s;
export function unused() {
    f = RegExp;
}
export const notRewritten = f("\\p{ASCII}", "u");
