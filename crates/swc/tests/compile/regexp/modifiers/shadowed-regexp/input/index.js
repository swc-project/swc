// The global `RegExp` is rewritten.
export const global = new RegExp("(?i:a)b", "g");

// A local binding named `RegExp` is not the built-in constructor, so its
// arguments are kept.
export function shadowed(RegExp) {
    return [RegExp("(?i:a)b", "g"), new RegExp("[[a-z]--b]", "v")];
}
