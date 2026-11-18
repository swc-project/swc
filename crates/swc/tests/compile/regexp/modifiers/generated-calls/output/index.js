// A generated `RegExp` call must use the global `RegExp`.
export function check(RegExp1) {
    return RegExp("(a)(?i:\\1)").test("aA");
}
// The flags of the call are `v`, which the targets do not support.
export const unicodeSetsFlag = new RegExp(/a/, "v");
// Duplicate names fail on the targets whatever the flags are.
export const duplicateNames = (flags)=>RegExp("(?<x>a)|(?<x>b)", flags);
// One warning for a literal that is kept for a call and then converted.
export const reportedOnce = new RegExp(RegExp("[a--b]", "v"), "v");
