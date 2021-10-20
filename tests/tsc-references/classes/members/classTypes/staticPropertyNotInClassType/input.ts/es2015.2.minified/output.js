var NonGeneric, Generic;
!function(NonGeneric) {
    class C {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {
        }
        constructor(a, b){
            this.a = a, this.b = b;
        }
    }
    (C || (C = {
    })).bar = "";
    var c = new C(1, 2);
    c.fn(), c.foo, c.bar, c.x;
}(NonGeneric || (NonGeneric = {
})), (function(Generic) {
    class C {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {
        }
        constructor(a, b){
            this.a = a, this.b = b;
        }
    }
    (C || (C = {
    })).bar = "";
    var c = new C(1, "");
    c.fn(), c.foo, c.bar, c.x;
})(Generic || (Generic = {
}));
