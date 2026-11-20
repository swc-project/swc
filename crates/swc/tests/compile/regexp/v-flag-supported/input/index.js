// The targets support the `v` flag, but not duplicate named groups.
// A `\q{...}` string with separate surrogates cannot be printed again, so
// the duplicate names are kept in a `RegExp` call, with a warning.
export const surrogatesInString = /(?<x>[\q{\u{D83D}\u{DE00}}])|(?<x>z)/v;
// The parser does not know this script name, so the duplicate names are
// kept in a `RegExp` call, with a warning.
export const unknownScript = /(?<a>\p{Script=Sidetic})|(?<a>b)/u;
// The call reads the pattern with the `v` flag, where `&&` is an operator.
// Moving the surrogate would change the class, so the names are kept in a
// `RegExp` call, with a warning.
export const crossMode = new RegExp(/(?<x>[a&&\uDC00])|(?<x>z)/u, "v");
// `\u0061` is the name `a`, so the names repeat.
export const escapedRepeatedName = /(?<a>\p{Script=Sidetic})|(?<\u0061>b)/u;
