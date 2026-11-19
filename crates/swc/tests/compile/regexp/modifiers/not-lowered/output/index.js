import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
// These cannot be lowered. They are kept, and a warning is reported.
export const backreference = RegExp("(a)(?i:\\1)");
export const propertyOfStrings = RegExp("\\p{RGI_Emoji}", "v");
export const unknownScript = RegExp("\\p{Script=Sidetic}(?i:a)", "u");
export const dynamicFlags = (flags)=>new RegExp(RegExp("(?i:a)"), flags);
export const dynamicFlagsWithString = (flags)=>new RegExp("(?i:a)", flags);
export const loneSurrogate = RegExp("\uD800(?i:a)");
// A shadowed `undefined` is not the global one, so the flags are unknown.
export const shadowedUndefined = (undefined)=>RegExp(RegExp("(?m:^a)"), undefined);
// No modifier group (the parenthesis is escaped), so there is no warning.
export const escapedParenthesis = (flags)=>new RegExp(/\(?i:a\)/, flags);
export const unknownPatternWithV = (pattern)=>RegExp(pattern, "v");
export const loneSurrogateWithV = RegExp("\uD800[a--b]", "v");
export const duplicateNamesInString = RegExp("(?<a>x)|(?<a>y)");
// Without captures, `\1` is a legacy octal escape, so this is lowered.
export const legacyOctal = /(?:\1)/;
// A reference to a duplicated name becomes `(?:\1\2)`, because only one of
// the groups can take part in a match.
export const duplicatedNameReference = _wrap_reg_exp(/(.)(?:\1\2)|(b)/, {
    a: [
        1,
        2
    ]
}, "(?<a>.)\\k<a>|(?<a>b)");
export function unusedDuplicateReference() {
    return _wrap_reg_exp(/(?:(a)|(b))(?:\1\2)/, {
        x: [
            1,
            2
        ]
    }, "(?:(?<x>a)|(?<x>b))\\k<x>");
}
