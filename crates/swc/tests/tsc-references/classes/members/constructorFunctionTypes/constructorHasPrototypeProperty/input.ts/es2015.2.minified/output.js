var NonGeneric, Generic;
!function(NonGeneric) {
    class C {
    }
    C.prototype.foo, (class extends C {
    }).prototype.bar;
}(NonGeneric || (NonGeneric = {
})), (function(Generic) {
    class C {
    }
    C.prototype.foo, (class extends C {
    }).prototype.baz;
})(Generic || (Generic = {
}));
