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

// `RegExp` calls are not rewritten; only regex literals are lowered.
export const constructorCall = new RegExp("[[a-z]--b]", "v");

// A property of strings without data is only converted to a `RegExp` call.
export const unsupported = /\p{RGI_Emoji}/v;

// Two lone surrogates are not one code point.
export const loneSurrogates = /\u{D800}\u{DC00}+/v;

// The call replaces the flags of the literal, so the literal is kept.
export const literalWithOtherFlags = new RegExp(/[^a]/vi, "");
export const literalWithUnicodeFlag = RegExp(/[a&&b]/v, "u");

// The flags can come from a spread, so the literal is kept.
export const spreadFlags = RegExp(/a(?-i:b)/i, ...["i"]);
// Parentheses do not hide the call or the literal, so the literal is kept.
export const parenthesizedLiteral = RegExp((/a(?-i:b)/i), "i");
export const parenthesizedCallee = (RegExp)(/a(?-i:b)/i, "i");
// `RegExp` calls with string patterns are kept.
export const undefinedFlags = RegExp("(?i:a)", undefined);
export const undefinedFlagsWithAddedFlag = new RegExp("(?m:^a$)", undefined);

// A template literal pattern is kept too.
export const templatePattern = new RegExp(`(?i:a)`, "g");
// `globalThis.RegExp` and optional calls are the global `RegExp` too, so the
// literal is kept.
export const globalThisCallee = new globalThis.RegExp(/(?-i:a)b/i, "i");
export const optionalCall = RegExp?.(/a(?-i:b)/i, "i");
// The flags replace the flags of either literal, so both are kept.
export const conditionalPattern = (x) => new RegExp(x ? /(?-i:a)/ : /(?-i:b)/, "i");
// A string pattern is kept even with a spread after the flags.
export const spreadAfterFlags = (extra) => RegExp("[[a-z]--b]", "v", ...extra);
// A literal anywhere in the pattern argument is kept when the call has flags.
export const logicalPattern = (re) => new RegExp(re || /(?-i:b)/, "i");
export const spreadPattern = new RegExp(...[/(?-i:b)/, "i"]);
// A feature check keeps working.
export function supportsUnicodeSets() {
    try {
        new RegExp("", "v");
        return true;
    } catch {
        return false;
    }
}
