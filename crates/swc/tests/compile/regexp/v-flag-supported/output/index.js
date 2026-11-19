// The targets support the `v` flag, but not duplicate named groups.
// A `\q{...}` string with separate surrogates cannot be printed again, so
// the duplicate names are kept, with a warning.
export const surrogatesInString = /(?<x>[\q{\u{D83D}\u{DE00}}])|(?<x>z)/v;
// The parser does not know this script name, so the duplicate names are
// kept, with a warning.
export const unknownScript = /(?<a>\p{Script=Sidetic})|(?<a>b)/u;
