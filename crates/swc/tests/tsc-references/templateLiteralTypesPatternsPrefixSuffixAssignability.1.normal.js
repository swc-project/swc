//// [templateLiteralTypesPatternsPrefixSuffixAssignability.ts]
var s1 = ":"; // should error
var s2 = "::"; // ok
var s3 = "::"; // should error
var s4 = ":::"; // ok
