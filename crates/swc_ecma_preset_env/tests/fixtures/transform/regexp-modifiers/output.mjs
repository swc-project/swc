export const enableIgnoreCase = /(?:[Aa])b/;
export const ignoreCaseClass = /(?:[A-Ca-c][^Xx])/;
export const disableIgnoreCase = /[Aa](?:b)[Cc]/g;
export const unicodeIgnoreCase = /(?:[Kk\u212A][0-9A-Z_a-z\u017F\u212A](?:(?<=[0-9A-Z_a-z\u017F\u212A])(?![0-9A-Z_a-z\u017F\u212A])|(?<![0-9A-Z_a-z\u017F\u212A])(?=[0-9A-Z_a-z\u017F\u212A])))/u;
export const dotAll = /(?:[\s\S])./;
export const multiline = /(?:^a$)/m;
export const scopedMultiline = /(?:(?<=^|[\x0A\x0D\u2028-\u2029])a)$/;
export const disableDotAll = /(?:.)[\s\S]/;
export const unicodeSets = /(?:[^Aa])[^b]/u;
export const notModifiers = /\(?i:[a--b]/v;
export const backreference = RegExp("(a)(?i:\\1)");
export const constructorCall = new RegExp("(?i:a)b", "g");
export const constructorWithoutFlags = new RegExp("(?s:.)");
export const callWithoutFlags = RegExp("(?m:^a$)");
export const literalWithFlags = new RegExp(RegExp("(?-i:a)"), "i");
export const literalWithEmptyFlags = new RegExp(RegExp("(?s:.)"), "");
export const literalWithDynamicFlags = new RegExp(RegExp("(?i:a)"), flags);
export const literalLoweredWithOwnFlags = new RegExp(/[^a]/vi, "");
export const literalWithUnicodeFlag = RegExp(/[a&&b]/v, "u");
export const literalWithUndefinedFlags = new RegExp(/(?:[Aa])/, undefined);
export const duplicateNamesWithSubtraction = _wrap_reg_exp(/([a--\uDC00])|(b)/v, {
    x: [
        1,
        2
    ]
}, "(?<x>[a--\\u{DC00}])|(?<x>b)");
