var OnlyDerived, WithBase;
!function(OnlyDerived) {
    class Base {
    }
    var t, t2, b, a2 = {
        foo: new class extends Base {
        }()
    }, b2 = {
        foo: new class extends Base {
        }()
    };
    t2 = t2, b = b, b2 = b2, t = t;
}(OnlyDerived || (OnlyDerived = {
})), (function(WithBase) {
    class Base {
    }
    var t, t2, b, a2 = {
        foo: new Base()
    }, b2 = {
        foo: new class extends Base {
        }()
    };
    t2 = t2, b = b, b2 = b2, t = t;
})(WithBase || (WithBase = {
}));
