var NonGeneric;
(function(NonGeneric) {
    class C1 {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {
        }
        constructor(a, b){
            this.a = a;
            this.b = b;
        }
    }
    (function(C) {
        C.bar = '';
    })(C1 || (C1 = {
    }));
    var c = new C1(1, 2);
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(NonGeneric || (NonGeneric = {
}));
var Generic;
(function(Generic) {
    class C2 {
        fn() {
            return this;
        }
        static get x() {
            return 1;
        }
        static set x(v) {
        }
        constructor(a, b){
            this.a = a;
            this.b = b;
        }
    }
    (function(C) {
        C.bar = '';
    })(C2 || (C2 = {
    }));
    var c = new C2(1, '');
    var r = c.fn();
    var r4 = c.foo; // error
    var r5 = c.bar; // error
    var r6 = c.x; // error
})(Generic || (Generic = {
}));
