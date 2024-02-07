//// [allowUnescapedParagraphAndLineSeparatorsInStringLiteral.ts]
// Strings containing unescaped line / paragraph separators
// Using both single quotes, double quotes and template literals
var stringContainingUnescapedLineSeparator1 = "\u2028STRING_CONTENT\u2028";
var stringContainingUnescapedParagraphSeparator1 = "\u2029STRING_CONTENT\u2029";
var stringContainingUnescapedLineSeparator2 = "\u2028STRING_CONTENT\u2028";
var stringContainingUnescapedParagraphSeparator2 = "\u2029STRING_CONTENT\u2029";
var stringContainingUnescapedLineSeparator3 = "\u2028STRING_CONTENT\u2028";
var stringContainingUnescapedParagraphSeparator3 = "\u2029STRING_CONTENT\u2029";
// Array of unescaped line / paragraph separators
var arr = [
    "\u2029\u2028STRING_CONTENT\u2028\u2029",
    "\u2028\u2029\u2029STRING_CONTENT\u2029\u2029\u2028",
    "STRING_CONTENT\u2029",
    "\u2028STRING_CONTENT",
    "",
    "\u2028"
];
