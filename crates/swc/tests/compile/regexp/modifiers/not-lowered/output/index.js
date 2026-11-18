// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = /(a)(?i:\1)/;
export const propertyOfStrings = RegExp("\\p{RGI_Emoji}", "v");
