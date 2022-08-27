//// [exponentiationOperatorWithTemplateStringInvalid.ts]
"".concat(3), "2".concat(3), "".concat(3, "4"), "2".concat(3, "4"), "".concat(3), "2".concat(3), "".concat(3, "4"), "2".concat(3, "4");
var k = 10;
k = Math.pow(k, "".concat(3)), k = Math.pow(k, "2".concat(3)), k = Math.pow(k, "2".concat(3, "4")), k = Math.pow(k, "2".concat(3, "4"));
