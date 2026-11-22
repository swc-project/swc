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

// A backreference in a case-insensitive group cannot be lowered, so the literal
// becomes a `RegExp` call, which fails only when it runs.
export const backreference = /(a)(?i:\1)/;

export const constructorCall = new RegExp("(?i:a)b", "g");

// `RegExp` calls are not rewritten, so that feature checks keep working.
export const constructorWithoutFlags = new RegExp("(?s:.)");
export const callWithoutFlags = RegExp("(?m:^a$)");

// Like Babel, a literal passed to `RegExp` is lowered with its own flags.
export const literalInCall = new RegExp(/(?i:a)/, "g");
// The targets support the `v` flag, but not duplicate names. Removing the
// names must keep the operands of `--` in place.
export const duplicateNamesWithSubtraction = /(?<x>[a--\u{DC00}])|(?<x>b)/v;
// Moving the trail surrogate to the front must not put the two `!` together,
// which a `v` class rejects.
export const punctuatorsAroundSurrogate = /(?<x>[!\u{DC00}!])|(?<x>z)/v;
// A `\q{...}` string cannot keep two separate surrogates apart when it is
// printed again, so the pattern is kept in a `RegExp` call.
export const surrogatesInString = /^(?:(?<x>[\q{\u{D83D}\u{DE00}}&&😀])|(?<x>z))\k<x>$/v;
// `--` keeps the two surrogates apart when the class is printed.
export const surrogatesAroundSubtraction = /^(?:(?<n>[\u{D800}--\u{DC00}])|(?<n>b))\k<n>$/v;
