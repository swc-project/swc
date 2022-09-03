//// [templateStringInFunctionExpression.ts]
var x = function() {
    return "abc".concat(0, "def"), "abc".concat(0, "def");
};
