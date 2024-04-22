//// [allowUnescapedParagraphAndLineSeparatorsInStringLiteral.ts]
// Strings containing unescaped line / paragraph separators
// Using both single quotes, double quotes and template literals
var stringContainingUnescapedLineSeparator1 = " STRING_CONTENT ";
var stringContainingUnescapedParagraphSeparator1 = " STRING_CONTENT ";
var stringContainingUnescapedLineSeparator2 = ' STRING_CONTENT ';
var stringContainingUnescapedParagraphSeparator2 = ' STRING_CONTENT ';
var stringContainingUnescapedLineSeparator3 = "\u2028STRING_CONTENT\u2028";
var stringContainingUnescapedParagraphSeparator3 = "\u2029STRING_CONTENT\u2029";
// Array of unescaped line / paragraph separators
var arr = [
    "  STRING_CONTENT  ",
    "   STRING_CONTENT   ",
    "STRING_CONTENT ",
    " STRING_CONTENT",
    "",
    ' '
];
