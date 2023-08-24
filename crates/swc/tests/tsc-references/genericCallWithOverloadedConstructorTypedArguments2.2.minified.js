//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
// Function typed arguments with multiple signatures must be passed an implementation that matches all of them
// Inferences are made quadratic-pairwise to and from these overload sets
var NonGenericParameter, GenericParameter, a, c, foo7;
NonGenericParameter || (NonGenericParameter = {}), GenericParameter || (GenericParameter = {}), (foo7 = function(x, cb) {
    return cb;
})(1, a), foo7(1, c);
