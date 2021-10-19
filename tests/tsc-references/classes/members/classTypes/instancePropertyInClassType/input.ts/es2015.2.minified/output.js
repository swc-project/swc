var NonGeneric, Generic;
!function(NonGeneric) {
    var c = new class {
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
    }(1, 2), r = c.fn();
    r.x, r.y, r.y = 4, c.y();
}(NonGeneric || (NonGeneric = {
})), (function(Generic) {
    var c = new class {
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
    }(1, ""), r = c.fn();
    r.x, r.y, r.y = "", c.y();
})(Generic || (Generic = {
}));
