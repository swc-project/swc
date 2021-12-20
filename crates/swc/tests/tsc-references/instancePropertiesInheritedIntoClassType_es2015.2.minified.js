var NonGeneric, Generic;
!function(NonGeneric) {
    class C {
        get y() {
            return 1;
        }
        set y(v) {
        }
        fn() {
            return this;
        }
        constructor(a, b){
            this.a = a, this.b = b;
        }
    }
    var d = new class extends C {
    }(1, 2), r = d.fn();
    r.x, r.y, r.y = 4, d.y();
}(NonGeneric || (NonGeneric = {
})), (function(Generic) {
    class C {
        get y() {
            return null;
        }
        set y(v) {
        }
        fn() {
            return this;
        }
        constructor(a, b){
            this.a = a, this.b = b;
        }
    }
    var d = new class extends C {
    }(1, ""), r = d.fn();
    r.x, r.y, r.y = "", d.y();
})(Generic || (Generic = {
}));
