//// [genericCallWithFunctionTypedArguments.ts]
function foo(x) {
    return x(null);
}
foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
}), foo(function(x) {
    return "";
});
