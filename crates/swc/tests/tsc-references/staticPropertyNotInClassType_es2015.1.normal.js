var NonGeneric;
(function(NonGeneric) {
    class C {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {}
        constructor(a, b){
            this.a = a;
            this.b = b;
        }
    }
    (function(C) {
        var bar = C.bar = '';
    })(C || (C = {}));
    var c = new C(1, 2);
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(NonGeneric || (NonGeneric = {}));
var Generic;
(function(Generic) {
    class C {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {}
        constructor(a, b){
            this.a = a;
            this.b = b;
        }
    }
    (function(C) {
        var bar = C.bar = '';
    })(C || (C = {}));
    var c = new C(1, '');
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(Generic || (Generic = {}));
