var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var b;
    function foo4(cb) {
        return new cb(null);
    }
    foo4(void 0), foo4(b);
}(NonGenericParameter || (NonGenericParameter = {})), GenericParameter || (GenericParameter = {});
