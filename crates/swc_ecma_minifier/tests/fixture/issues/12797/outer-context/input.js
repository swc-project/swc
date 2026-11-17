"use strict";

// A heritage expression and computed keys use the `this` and `new.target` of
// the code around the class. In strict code, a function there is strict
// outside the class too. So these unused classes can be dropped.
function f() {
    class C extends (foo(this, new.target), Object) {
        static set(x) {
            C.value = x;
        }
    }

    class D {
        static set(x) {
            D.value = x;
        }
        [foo(this, new.target)]() {}
        [bar(function () {
            return this;
        })]() {}
    }
}

new f();
