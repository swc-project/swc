// The targets support the `v` flag, but not duplicate named groups.
// A `\q{...}` string with separate surrogates cannot be printed again, so
// the duplicate names are kept in a `RegExp` call, with a warning.
export const surrogatesInString = RegExp("(?<x>[\\q{\\u{D83D}\\u{DE00}}])|(?<x>z)", "v");
// The parser does not know this script name, so the duplicate names are
// kept in a `RegExp` call, with a warning.
export const unknownScript = RegExp("(?<a>\\p{Script=Sidetic})|(?<a>b)", "u");
// `\u0061` is the name `a`, so the names repeat.
export const escapedRepeatedName = RegExp("(?<a>\\p{Script=Sidetic})|(?<\\u0061>b)", "u");
