var _RegExp, _globalThis;
// Optional chaining is lowered first, through a temporary binding for
// `RegExp`. The literal is still kept, because the call replaces its flags.
export const optionalCall = (_RegExp = RegExp) === null || _RegExp === void 0 ? void 0 : _RegExp(RegExp("(?-i:a)"), "i");
export const optionalMember = (_globalThis = globalThis) === null || _globalThis === void 0 ? void 0 : _globalThis.RegExp(RegExp("(?-i:a)"), "i");
// A generated `RegExp` call must use the global `RegExp`.
export function check(RegExp1) {
    return RegExp("(a)(?i:\\1)").test("aA");
}
// The flags of the call are `v`, which the targets do not support.
export const unicodeSetsFlag = new RegExp(/a/, "v");
// Duplicate names fail on the targets whatever the flags are.
export const duplicateNames = (flags)=>RegExp("(?<x>a)|(?<x>b)", flags);
