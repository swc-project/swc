//// [genericCallWithOverloadedConstructorTypedArguments.ts]
var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var foo4 = function(cb) {
        return new cb(null);
    };
    foo4(void 0), foo4(void 0);
}(NonGenericParameter || (NonGenericParameter = {})), function(GenericParameter) {
    var a, b, foo5 = function(cb) {
        return cb;
    }, foo6 = function(cb) {
        return cb;
    }, foo7 = function(x, cb) {
        return cb;
    };
    foo5(a), foo5(b), foo6(a), foo6(b), foo7(1, b), foo7(1, void 0), foo7(1, void 0);
}(GenericParameter || (GenericParameter = {}));
