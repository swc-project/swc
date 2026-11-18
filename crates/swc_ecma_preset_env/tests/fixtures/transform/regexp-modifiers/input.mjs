export const enableIgnoreCase = /(?i:a)b/;
export const ignoreCaseClass = /(?i:[a-c][^x])/;
export const disableIgnoreCase = /a(?-i:b)c/gi;
export const unicodeIgnoreCase = /(?i:k\w\b)/u;
export const dotAll = /(?s:.)./;
export const multiline = /(?m:^a$)/;
export const scopedMultiline = /(?m:^a)$/;
export const disableDotAll = /(?-s:.)./s;

// `v` patterns are lowered to `u` patterns before the modifiers.
export const unicodeSets = /(?i:[^a])[^b]/v;

// An escaped parenthesis is not a modifier group, so the supported `v` flag
// is kept.
export const notModifiers = /\(?i:[a--b]/v;

// A backreference in a case-insensitive group cannot be lowered.
export const backreference = /(a)(?i:\1)/;

export const constructorCall = new RegExp("(?i:a)b", "g");

// Lowering can add a flag, so a call without flags gets a flags argument.
export const constructorWithoutFlags = new RegExp("(?s:.)");
export const callWithoutFlags = RegExp("(?m:^a$)");

// The flags of the call replace the flags of a regex literal argument.
export const literalWithFlags = new RegExp(/(?-i:a)/, "i");
export const literalWithEmptyFlags = new RegExp(/(?s:.)/, "");
// The flags are unknown, so the literal is kept.
export const literalWithDynamicFlags = new RegExp(/(?i:a)/, flags);
// The literal is not lowered with its own flags, because the call replaces
// them.
export const literalLoweredWithOwnFlags = new RegExp(/[^a]/vi, "");
export const literalWithUnicodeFlag = RegExp(/[a&&b]/v, "u");
// `undefined` keeps the flags of the literal.
export const literalWithUndefinedFlags = new RegExp(/(?i:a)/, undefined);
