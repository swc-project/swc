// Optional chaining is lowered first, through a temporary binding for
// `RegExp`. The literal is still kept, because the call replaces its flags.
export const optionalCall = RegExp?.(/(?-i:a)/, "i");
export const optionalMember = globalThis?.RegExp(/(?-i:a)/, "i");

// A generated `RegExp` call must use the global `RegExp`.
export function check(RegExp) {
    return /(a)(?i:\1)/.test("aA");
}

// The flags of the call are `v`, which the targets do not support.
export const unicodeSetsFlag = new RegExp(/a/, "v");
// Duplicate names fail on the targets whatever the flags are.
export const duplicateNames = (flags) => RegExp("(?<x>a)|(?<x>b)", flags);
