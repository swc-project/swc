//// [genericCallWithOverloadedFunctionTypedArguments.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
var NonGenericParameter, GenericParameter, foo4, a, foo5, foo6, foo7;
NonGenericParameter || (NonGenericParameter = {}), (foo4 = function(cb) {
    return cb;
})(void 0), foo4(function(x) {
    return x;
}), foo4(function(x) {
    return x;
}), GenericParameter || (GenericParameter = {}), foo5 = function(cb) {
    return cb;
}, foo6 = function(cb) {
    return cb;
}, foo7 = function(x, cb) {
    return cb;
}, foo5(function(x) {
    return x;
}), foo5(a), foo6(function(x) {
    return x;
}), foo6(function(x) {
    return "";
}), foo6(function(x, y) {
    return "";
}), foo7(1, function(x) {
    return x;
}), foo7(1, function(x) {
    return "";
}), foo7(1, a);
