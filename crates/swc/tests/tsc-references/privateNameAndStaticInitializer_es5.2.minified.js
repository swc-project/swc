var A = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, A), _foo.set(this, {
        writable: !0,
        value: 1
    }), _prop.set(this, {
        writable: !0,
        value: 2
    });
}, _foo = new WeakMap(), _prop = new WeakMap();
A.inst = new A();
