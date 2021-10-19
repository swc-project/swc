var NonGenericParameter, GenericParameter;
!function(NonGenericParameter) {
    var a;
    function foo4(cb) {
        return cb;
    }
    foo4(a), foo4((x)=>x
    ), foo4((x)=>x
    );
}(NonGenericParameter || (NonGenericParameter = {
})), (function(GenericParameter) {
    var a, a;
    function foo5(cb) {
        return cb;
    }
    function foo6(cb) {
        return cb;
    }
    function foo7(x, cb) {
        return cb;
    }
    foo5((x)=>x
    ), foo5(a), foo6((x)=>x
    ), foo6((x)=>""
    ), foo6((x, y)=>""
    ), foo7(1, (x)=>x
    ), foo7(1, (x)=>""
    ), foo7(1, a);
})(GenericParameter || (GenericParameter = {
}));
