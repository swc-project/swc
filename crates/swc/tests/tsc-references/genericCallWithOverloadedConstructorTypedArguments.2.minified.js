//// [genericCallWithOverloadedConstructorTypedArguments.ts]
var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var b, foo4 = function(cb) {
        return new cb(null);
    };
    foo4(void 0), foo4(b);
}(NonGenericParameter || (NonGenericParameter = {})), function(GenericParameter) {
    var a, b, c, c2, foo5 = function(cb) {
        return cb;
    }, foo6 = function(cb) {
        return cb;
    }, foo7 = function(x, cb) {
        return cb;
    };
    foo5(a), foo5(b), foo6(a), foo6(b), foo7(1, b), foo7(1, c), foo7(1, c2);
}(GenericParameter || (GenericParameter = {}));
