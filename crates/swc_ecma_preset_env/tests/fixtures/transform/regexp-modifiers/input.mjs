export const enableIgnoreCase = /(?i:a)b/;
export const ignoreCaseClass = /(?i:[a-c][^x])/;
export const disableIgnoreCase = /a(?-i:b)c/gi;
export const unicodeIgnoreCase = /(?i:k\w\b)/u;
export const dotAll = /(?s:.)./;
export const multiline = /(?m:^a$)/;
export const disableDotAll = /(?-s:.)./s;

// `v` patterns are lowered to `u` patterns before the modifiers.
export const unicodeSets = /(?i:[^a])[^b]/v;

// An escaped parenthesis is not a modifier group, so the supported `v` flag
// is kept.
export const notModifiers = /\(?i:[a--b]/v;

// A backreference in a case-insensitive group cannot be lowered.
export const backreference = /(a)(?i:\1)/;

export const constructorCall = new RegExp("(?i:a)b", "g");
