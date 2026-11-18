// Examples from https://github.com/swc-project/swc/issues/12722
export const duplicateNamedGroups = /(?<year>\d{4})-\d{2}|\d{2}-(?<year>\d{4})/;
export const modifiers = /(?i:a)b/;
export const unicodeSets = /[\p{L}--[a-z]]/v;

// Set operations and nested classes.
export const subtraction = /[[a-z]--[aeiou]]/v;
export const intersection = /[\p{ASCII}&&\p{L}]+/gv;
export const negated = /[^[a-z]--b]/v;

// Strings in a class become a group, with the longest strings first.
export const strings = /[\q{abc|d|}x]/v;

// Case-insensitive complements are computed after case folding.
export const ignoreCase = /[^a]\P{Lu}/iv;

// Characters that need an escape only in a `v` class.
export const reservedPunctuators = /[\&\-\]\(]/v;

// The `v` flag combined with named groups.
export const namedGroups = /(?<word>[\w--\d]+)/v;

// The `RegExp` constructor with literal arguments.
export const constructorCall = new RegExp("[[a-z]--b]", "v");

// A property of strings without data is only converted to a `RegExp` call.
export const unsupported = /\p{RGI_Emoji}/v;

// Two lone surrogates are not one code point.
export const loneSurrogates = /\u{D800}\u{DC00}+/v;
