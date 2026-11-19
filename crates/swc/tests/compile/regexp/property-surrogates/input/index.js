// Unicode property escapes are expanded. Two escaped lone surrogates must stay
// two characters, and must not be printed as a surrogate pair.
export const literal = /\p{Lu}\u{D83D}\u{DE00}/u;
export const call = new RegExp("\\p{Lu}\\u{D83D}\\u{DE00}", "u");
// The call replaces the flags, so an expansion for the `u` flag could be
// invalid. The literal is kept, with a warning.
export const replacedFlags = new RegExp(/^\p{Script=Deseret}$/u, "");
