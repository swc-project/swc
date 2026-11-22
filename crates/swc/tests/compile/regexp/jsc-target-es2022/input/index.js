// `es2022` has no modifiers or duplicate named groups (ES2025). The `v` flag is
// ES2024.
export const duplicateNamedGroups = /(?<y>a)|(?<y>b)/;
export const modifiers = /(?i:a)b/;
export const unicodeSets = /[[a-z]--[aeiou]]/v;
