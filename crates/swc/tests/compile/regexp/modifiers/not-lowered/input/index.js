// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = /(a)(?i:\1)/;
export const propertyOfStrings = /\p{RGI_Emoji}/v;
export const duplicatedNameReference = /(?<a>.)\k<a>|(?<a>b)/;
export const unknownScript = /\p{Script=Sidetic}(?i:a)/u;
export const dynamicFlags = (flags) => new RegExp(/(?i:a)/, flags);
export const dynamicFlagsWithString = (flags) => new RegExp("(?i:a)", flags);
export const loneSurrogate = RegExp("\uD800(?i:a)");
// A shadowed `undefined` is not the global one, so the flags are unknown.
export const shadowedUndefined = (undefined) => RegExp(/(?m:^a)/, undefined);
// No modifier group (the parenthesis is escaped), so there is no warning.
export const escapedParenthesis = (flags) => new RegExp(/\(?i:a\)/, flags);
export const unknownPatternWithV = (pattern) => RegExp(pattern, "v");
export const loneSurrogateWithV = RegExp("\uD800[a--b]", "v");
export const duplicateNamesInString = RegExp("(?<a>x)|(?<a>y)");
// Without captures, `\1` is a legacy octal escape, so this is lowered.
export const legacyOctal = /(?i:\1)/;
// The duplicated name cannot be lowered, so the regex becomes a `RegExp` call
// that fails only when it runs.
export function unusedDuplicateReference() {
    return /(?:(?<x>a)|(?<x>b))\k<x>/;
}
