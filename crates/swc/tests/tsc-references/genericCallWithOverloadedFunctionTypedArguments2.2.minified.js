//// [genericCallWithOverloadedFunctionTypedArguments2.ts]
var NonGenericParameter, GenericParameter, a, foo7;
NonGenericParameter || (NonGenericParameter = {}), GenericParameter || (GenericParameter = {}), (foo7 = function(x, cb) {
    return cb;
})(1, function(x) {
    return x;
}), foo7(1, a);
