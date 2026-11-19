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
