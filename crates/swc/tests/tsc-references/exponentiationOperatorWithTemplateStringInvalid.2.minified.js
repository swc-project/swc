//// [exponentiationOperatorWithTemplateStringInvalid.ts]
var a = Math.pow(1, "".concat(3)), b = Math.pow(1, "2".concat(3)), c = Math.pow(1, "".concat(3, "4")), d = Math.pow(1, "2".concat(3, "4")), e = Math.pow("".concat(3), 5), f = Math.pow("2".concat(3), 5), g = Math.pow("".concat(3, "4"), 5), h = Math.pow("2".concat(3, "4"), 5), k = 10;
k = Math.pow(k, "".concat(3)) = Math.pow(k, "2".concat(3)), k = Math.pow(k, "2".concat(3, "4")) = Math.pow(k, "2".concat(3, "4"));
