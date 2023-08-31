//// [genericCallWithOverloadedConstructorTypedArguments.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
var NonGenericParameter, GenericParameter, b, foo4, a, b1, c, c2, foo5, foo6, foo7;
NonGenericParameter || (NonGenericParameter = {}), (foo4 = function(cb) {
    return new cb(null);
})(void 0), foo4(b), GenericParameter || (GenericParameter = {}), foo5 = function(cb) {
    return cb;
}, foo6 = function(cb) {
    return cb;
}, foo7 = function(x, cb) {
    return cb;
}, foo5(a), foo5(b1), foo6(a), foo6(b1), foo7(1, b1), foo7(1, c), foo7(1, c2);
