//// [genericCallWithOverloadedFunctionTypedArguments2.ts]
NonGenericParameter = {}, function(GenericParameter1) {
    var a, foo7 = function(x, cb) {
        return cb;
    };
    foo7(1, function(x) {
        return x;
    }), foo7(1, a);
}(GenericParameter = {});
