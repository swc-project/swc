var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var b;
    function foo4(cb) {
        return new cb(null);
    }
    foo4(void 0), foo4(b);
}(NonGenericParameter || (NonGenericParameter = {
})), (function(GenericParameter) {
    var a, b, c, c2;
    function foo5(cb) {
        return cb;
    }
    function foo6(cb) {
        return cb;
    }
    function foo7(x, cb) {
        return cb;
    }
    foo5(a), foo5(b), foo6(a), foo6(b), foo7(1, b), foo7(1, c), foo7(1, c2);
})(GenericParameter || (GenericParameter = {
}));
