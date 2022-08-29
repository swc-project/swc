//// [contextuallyTypedFunctionExpressionsAndReturnAnnotations.ts]
// Contextually type the parameter even if there is a return annotation
foo(function(y) {
    var z = y.charAt(0); // Should be string
    return null;
});
foo(function(y) {
    return function(y2) {
        var z = y2.toFixed(); // Should be string
        return 0;
    };
});
