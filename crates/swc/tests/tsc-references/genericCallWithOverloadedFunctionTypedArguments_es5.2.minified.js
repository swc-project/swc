var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var foo4 = function(cb) {
        return cb;
    };
    foo4(void 0), foo4(function(x) {
        return x;
    }), foo4(function(x) {
        return x;
    });
}(NonGenericParameter || (NonGenericParameter = {})), function(GenericParameter) {
    var a, foo5 = function(cb) {
        return cb;
    }, foo6 = function(cb) {
        return cb;
    }, foo7 = function(x, cb) {
        return cb;
    };
    foo5(function(x) {
        return x;
    }), foo5(a), foo6(function(x) {
        return x;
    }), foo6(function(x) {
        return "";
    }), foo6(function(x, y) {
        return "";
    }), foo7(1, function(x) {
        return x;
    }), foo7(1, function(x) {
        return "";
    }), foo7(1, a);
}(GenericParameter || (GenericParameter = {}));
