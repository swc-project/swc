//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
NonGenericParameter = {}, function(GenericParameter1) {
    var c, foo7 = function(x, cb) {
        return cb;
    };
    foo7(1, void 0), foo7(1, c);
}(GenericParameter = {});
