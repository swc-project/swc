//// [logicalOrExpressionIsNotContextuallyTyped.ts]
var a, r = a || function(a) {
    return a.toLowerCase();
};
