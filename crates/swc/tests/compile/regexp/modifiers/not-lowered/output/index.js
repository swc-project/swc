// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = RegExp("(a)(?i:\\1)");
export const propertyOfStrings = RegExp("\\p{RGI_Emoji}", "v");
export const unknownScript = RegExp("\\p{Script=Sidetic}(?i:a)", "u");
// Without captures, `\1` is a legacy octal escape, so this is lowered.
export const legacyOctal = /(?:\1)/;
// A reference to a duplicated name has no indexed equivalent.
export const duplicatedNameReference = RegExp("(?<a>.)\\k<a>|(?<a>b)");
