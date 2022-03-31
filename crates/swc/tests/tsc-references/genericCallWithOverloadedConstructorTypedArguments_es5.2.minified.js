var NonGenericParameter;
!function(NonGenericParameter) {
    var b, foo4 = function(cb) {
        return new cb(null);
    };
    foo4(void 0), foo4(b);
}(NonGenericParameter || (NonGenericParameter = {}));
