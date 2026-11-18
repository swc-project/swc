// The global `RegExp` is rewritten.
export const global = new RegExp("(?:[Aa])b", "g");
// A local binding named `RegExp` is not the built-in constructor, so its
// arguments are kept.
export function shadowed(RegExp1) {
    return [
        RegExp1("(?i:a)b", "g"),
        new RegExp1("[[a-z]--b]", "v")
    ];
}
