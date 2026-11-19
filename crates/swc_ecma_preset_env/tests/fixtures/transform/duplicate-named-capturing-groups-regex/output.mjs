export const duplicateNamedGroups = _wrap_reg_exp(/(\d{4})-\d{2}|\d{2}-(\d{4})/, {
    year: [
        1,
        2
    ]
}, "(?<year>\\d{4})-\\d{2}|\\d{2}-(?<year>\\d{4})");
export const uniqueNamedGroups = /(?<year>\d{4})-(?<month>\d{2})/;
export const mixedGroups = _wrap_reg_exp(/(?:(x)(1)|(y))(z)/u, {
    a: [
        1,
        3
    ],
    b: 2,
    c: 4
}, "(?:(?<a>x)(?<b>1)|(?<a>y))(?<c>z)");
export const duplicateReference = _wrap_reg_exp(/(?:(a)|(b))(?:\1\2)/, {
    x: [
        1,
        2
    ]
}, "(?:(?<x>a)|(?<x>b))\\k<x>");
export const uniqueReference = _wrap_reg_exp(/(x)\1|(1)|(2)/, {
    a: 1,
    b: [
        2,
        3
    ]
}, "(?<a>x)\\k<a>|(?<b>1)|(?<b>2)");
export const escapedName = _wrap_reg_exp(/(a)(?:\1\2)|(b)/, {
    x: [
        1,
        2
    ]
}, "(?<\\u0078>a)\\k<x>|(?<x>b)");
export const digitAfterReference = _wrap_reg_exp(/^(?:(a)|(b))(?:\1\2)(c)(?:\3)0$/u, {
    x: [
        1,
        2
    ],
    z: 3
}, "^(?:(?<x>a)|(?<x>b))\\k<x>(?<z>c)\\k<z>0$");
export const loneSurrogates = _wrap_reg_exp(/^(?:([\uD800-\uD800][\uDC00-\uDC00])|(z))(?:\1\2)$/u, {
    x: [
        1,
        2
    ]
}, "^(?:(?<x>\\u{D800}\\u{DC00})|(?<x>z))\\k<x>$");
export const bothParticipate = RegExp("(?:(?<x>a)|z)(?:(?<x>b))\\k<x>");
export const escapedNameInOneAlternative = /(?<x>a)(?<\u0078>b)/;
export const protoName = _wrap_reg_exp(/(a)|(b)/, _define_property({}, "__proto__", [
    1,
    2
]), "(?<__proto__>a)|(?<__proto__>b)");
export const escapedReference = _wrap_reg_exp(/(?:(a)|(b))(?:\1\2)/, {
    x: [
        1,
        2
    ]
}, "(?:(?<x>a)|(?<x>b))\\k<\\u0078>");
export const protoFirst = _wrap_reg_exp(/(a)(c)|(b)/, _define_property(_define_property({}, "__proto__", [
    1,
    3
]), "later", 2), "(?<__proto__>a)(?<later>c)|(?<__proto__>b)");
