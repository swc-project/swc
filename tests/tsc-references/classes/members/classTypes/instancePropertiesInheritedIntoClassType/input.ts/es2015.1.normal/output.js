var NonGeneric;
(function(NonGeneric) {
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
            this.a = a;
            this.b = b;
        }
    }
    class D extends C {
    }
    var d = new D(1, 2);
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = 4;
    var r6 = d.y(); // error
})(NonGeneric || (NonGeneric = {
}));
var Generic;
(function(Generic) {
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
            this.a = a;
            this.b = b;
        }
    }
    class D extends C {
    }
    var d = new D(1, '');
    var r = d.fn();
    var r2 = r.x;
    var r3 = r.y;
    r.y = '';
    var r6 = d.y(); // error
})(Generic || (Generic = {
}));
