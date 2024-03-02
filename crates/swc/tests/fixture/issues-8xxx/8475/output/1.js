export const CSS_INTEGER = '[-\\+]?\\d+%?';
export const CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
export const CSS_UNIT = `(?:${CSS_NUMBER})\|(?:${CSS_INTEGER})`;
export var CSS_INTEGER2 = '[-\\+]?\\d+%?';
export var CSS_NUMBER2 = '[-\\+]?\\d*\\.\\d+%?';
export var CSS_UNIT2 = "(?:".concat(CSS_NUMBER, ")\|(?:").concat(CSS_INTEGER, ")");
