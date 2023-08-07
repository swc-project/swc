//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
var NonGenericParameter, GenericParameter, a, c, foo7;
NonGenericParameter || (NonGenericParameter = {}), GenericParameter || (GenericParameter = {}), (foo7 = function(x, cb) {
    return cb;
})(1, a), foo7(1, c);
