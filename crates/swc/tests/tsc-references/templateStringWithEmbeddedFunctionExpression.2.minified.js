//// [templateStringWithEmbeddedFunctionExpression.ts]
"abc".concat(function y() {
    return y;
}, "def");
