//// [unicodeExtendedEscapesInRegularExpressions14_ES6.ts]
// Shouldn't work, negatives are not allowed.
var x = /\u{-DDDD}/g;
