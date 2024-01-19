// 4.x
const CSS_INTEGER = '[-\\+]?\\d+%?';
const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
const CSS_UNIT = `(?:${CSS_NUMBER})\|(?:${CSS_INTEGER})`;

// 3.x
var CSS_INTEGER2 = '[-\\+]?\\d+%?';
var CSS_NUMBER2 = '[-\\+]?\\d*\\.\\d+%?';
var CSS_UNIT2 = "(?:".concat(CSS_NUMBER, ")\|(?:").concat(CSS_INTEGER, ")");