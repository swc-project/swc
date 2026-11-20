// `jsc.target` lowers the regex syntax that the version does not have, like
// `env.targets`.
export const duplicateNamedGroups = /(?<year>\d{4})-\d{2}|\d{2}-(?<year>\d{4})/;
export const modifiers = /(?i:a)b/;
export const unicodeSets = /[\p{L}--[a-z]]/v;
