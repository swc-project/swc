//// [templateStringWithEmbeddedArrowFunction.ts]
"abc".concat(function(x) {
    return x;
}, "def");
