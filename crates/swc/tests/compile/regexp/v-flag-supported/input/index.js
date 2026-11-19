// The targets support the `v` flag, but not duplicate named groups.
// A `\q{...}` string with separate surrogates cannot be printed again, so
// the duplicate names are kept, with a warning.
export const surrogatesInString = /(?<x>[\q{\u{D83D}\u{DE00}}])|(?<x>z)/v;
