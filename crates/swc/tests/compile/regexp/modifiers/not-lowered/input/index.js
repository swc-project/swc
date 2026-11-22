// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = /(a)(?i:\1)/;
export const propertyOfStrings = /\p{RGI_Emoji}/v;
export const unknownScript = /\p{Script=Sidetic}(?i:a)/u;
// Without captures, `\1` is a legacy octal escape, so this is lowered.
export const legacyOctal = /(?i:\1)/;
// A reference to a duplicated name has no indexed equivalent.
export const duplicatedNameReference = /(?<a>.)\k<a>|(?<a>b)/;
