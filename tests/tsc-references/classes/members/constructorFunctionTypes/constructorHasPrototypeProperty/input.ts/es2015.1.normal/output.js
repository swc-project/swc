var NonGeneric;
(function(NonGeneric) {
    class C {
    }
    class D extends C {
    }
    var r = C.prototype;
    r.foo;
    var r2 = D.prototype;
    r2.bar;
})(NonGeneric || (NonGeneric = {
}));
var Generic;
(function(Generic) {
    class C {
    }
    class D extends C {
    }
    var r = C.prototype; // C<any, any>
    var ra = r.foo; // any
    var r2 = D.prototype; // D<any, any>
    var rb = r2.baz; // any
})(Generic || (Generic = {
}));
