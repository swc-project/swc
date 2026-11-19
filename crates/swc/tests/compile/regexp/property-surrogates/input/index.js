// Unicode property escapes are expanded. Two escaped lone surrogates must stay
// two characters, and must not be printed as a surrogate pair.
export const literal = /\p{Lu}\u{D83D}\u{DE00}/u;
export const call = new RegExp("\\p{Lu}\\u{D83D}\\u{DE00}", "u");
// The call replaces the flags, so an expansion for the `u` flag could be
// invalid. The literal is kept, with a warning.
export const replacedFlags = new RegExp(/^\p{Script=Deseret}$/u, "");
// The flags of the call have the same Unicode mode, so the expansion is still
// valid and is done.
export const sameUnicodeMode = new RegExp(/^\p{Script=Deseret}$/u, "gu");
// After an unknown spread, `"a"` is the last value that can be the pattern,
// so the third element is expanded as usual.
export const ignoredAfterSpread = (prefix) => RegExp(...prefix, ...["a", "g", /\p{ASCII}/u]);
