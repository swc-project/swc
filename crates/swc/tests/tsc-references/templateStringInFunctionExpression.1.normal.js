//// [templateStringInFunctionExpression.ts]
var x = function y() {
    "abc".concat(0, "def");
    return "abc".concat(0, "def");
};
