// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = /(a)(?i:\1)/;
export const propertyOfStrings = /\p{RGI_Emoji}/v;
export const duplicatedNameReference = /(?<a>.)\k<a>|(?<a>b)/;
export const unknownScript = /\p{Script=Sidetic}(?i:a)/u;
export const dynamicFlags = (flags) => new RegExp(/(?i:a)/, flags);
