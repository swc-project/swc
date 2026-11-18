// A call to the global `RegExp` is not rewritten, but it is reported.
export const global = new RegExp("(?i:a)b", "g");

// A local binding named `RegExp` is not the built-in constructor, so it is not
// reported.
export function shadowed(RegExp) {
    return [RegExp("(?i:a)b", "g"), new RegExp("[[a-z]--b]", "v")];
}
