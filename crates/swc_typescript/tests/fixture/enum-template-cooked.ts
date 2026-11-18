export enum TemplateMemberKeys {
    "A" = 1,
    FromCooked = TemplateMemberKeys[`\x41`] + 1,
    "\uD800" = 1,
    FromString = TemplateMemberKeys["\uD800"] + 1,
    FromTemplate = TemplateMemberKeys[`\uD800`] + 2,
    LoneSurrogate = `\uD800`,
    InterpolatedSurrogate = `x${"\uD800"}y`,
}
