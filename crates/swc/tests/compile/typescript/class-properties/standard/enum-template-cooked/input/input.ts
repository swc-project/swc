enum TemplateCooked {
    "\uD800" = 1,
    FromString = TemplateCooked["\uD800"] + 1,
    FromTemplate = TemplateCooked[`\uD800`] + 2,
    Escaped = `line\n`,
    Interpolated = `value:\x20${1}\u0021`,
    LoneSurrogate = `\uD800`,
    InterpolatedSurrogate = `x${"\uD800"}y`,
    ConcatenatedSurrogate = "\uD800" + "x",
}
