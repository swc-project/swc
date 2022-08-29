//// [contextuallyTypedFunctionExpressionsAndReturnAnnotations.ts]
foo(function(y) {
    return y.charAt(0), null;
}), foo(function(y) {
    return function(y2) {
        return y2.toFixed(), 0;
    };
});
