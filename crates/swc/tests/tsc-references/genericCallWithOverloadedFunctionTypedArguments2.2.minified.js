//// [genericCallWithOverloadedFunctionTypedArguments2.ts]
var NonGenericParameter, GenericParameter;
NonGenericParameter || (NonGenericParameter = {}), function(GenericParameter) {
    var a, foo7 = function(x, cb) {
        return cb;
    };
    foo7(1, function(x) {
        return x;
    }), foo7(1, a);
}(GenericParameter || (GenericParameter = {}));
