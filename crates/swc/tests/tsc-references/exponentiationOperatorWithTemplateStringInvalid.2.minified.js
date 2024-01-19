//// [exponentiationOperatorWithTemplateStringInvalid.ts]
var k = 10;
k = Math.pow(10, "".concat(3)), k = Math.pow(k, "2".concat(3)), k = Math.pow(k, "2".concat(3, "4"));
