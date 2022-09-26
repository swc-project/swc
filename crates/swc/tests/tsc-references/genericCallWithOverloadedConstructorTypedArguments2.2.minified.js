//// [genericCallWithOverloadedConstructorTypedArguments2.ts]
var NonGenericParameter, GenericParameter;
NonGenericParameter || (NonGenericParameter = {}), function(GenericParameter) {
    var foo7 = function(x, cb) {
        return cb;
    };
    foo7(1, void 0), foo7(1, void 0);
}(GenericParameter || (GenericParameter = {}));
