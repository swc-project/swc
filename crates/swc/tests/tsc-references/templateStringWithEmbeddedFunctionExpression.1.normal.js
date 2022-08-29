//// [templateStringWithEmbeddedFunctionExpression.ts]
var x = "abc".concat(function y() {
    return y;
}, "def");
