// Unicode property escapes are expanded. Two escaped lone surrogates must stay
// two characters, and must not be printed as a surrogate pair.
export const literal = /\p{Lu}\u{D83D}\u{DE00}/u;
export const call = new RegExp("\\p{Lu}\\u{D83D}\\u{DE00}", "u");
