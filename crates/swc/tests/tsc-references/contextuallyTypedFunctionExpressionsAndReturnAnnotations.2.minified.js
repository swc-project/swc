//// [contextuallyTypedFunctionExpressionsAndReturnAnnotations.ts]
// Contextually type the parameter even if there is a return annotation
foo(function(y) {
    return y.charAt(0), null;
}), foo(function(y) {
    return function(y2) {
        return y2.toFixed(), 0;
    };
});
