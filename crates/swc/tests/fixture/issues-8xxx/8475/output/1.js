let CSS_UNIT = `(?:${CSS_NUMBER})\|(?:${CSS_INTEGER})`;
var CSS_INTEGER2 = '[-\\+]?\\d+%?';
var CSS_NUMBER2 = '[-\\+]?\\d*\\.\\d+%?';
var CSS_UNIT2 = "(?:".concat(CSS_NUMBER, ")\|(?:").concat(CSS_INTEGER, ")");
let CSS_INTEGER = '[-\\+]?\\d+%?', CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
export { CSS_INTEGER, CSS_NUMBER, CSS_UNIT, CSS_INTEGER2, CSS_NUMBER2, CSS_UNIT2 };
