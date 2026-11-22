import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
// `es2024` has no modifiers or duplicate named groups (ES2025). The `v` flag is
// ES2024.
export const duplicateNamedGroups = _wrap_reg_exp(/(a)|(b)/, {
    y: [
        1,
        2
    ]
}, "(?<y>a)|(?<y>b)");
export const modifiers = /(?:[Aa])b/;
export const unicodeSets = /[[a-z]--[aeiou]]/v;
