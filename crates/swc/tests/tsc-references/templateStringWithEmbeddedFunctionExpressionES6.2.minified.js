//// [templateStringWithEmbeddedFunctionExpressionES6.ts]
var x = `abc${function y() {
    return y;
}}def`;
