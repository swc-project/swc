import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
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
// A spread of an array literal supplies the pattern and the flags.
export const spreadArguments = RegExp(...[
    "(?i:a)",
    "g"
]);
export const spreadUnicodeSets = new RegExp("[a--b]", ...[
    "v"
]);
// Without flags, the call copies only the pattern of the wrapped literal, so
// the matches have no `groups`.
export const copiedNamedGroups = new RegExp(_wrap_reg_exp(/(a)|(b)/, {
    x: [
        1,
        2
    ]
}, "(?<x>a)|(?<x>b)"));
// The pattern and the flags are known before the unknown spread.
export const knownBeforeSpread = (extra)=>RegExp(...[
        "a",
        "v"
    ], ...extra);
// A hole supplies an empty pattern, but the flags still need the `v` flag.
export const holePattern = RegExp(...[
    ,
    "v"
]);
// The call replaces the flags, and `\u{61}` cannot be printed again as
// written, so the duplicate names are kept, with a warning.
export const replacedFlagsSpelling = new RegExp(/^(?:(?<x>\u{61})|(?<x>b))\k<x>$/u, "");
