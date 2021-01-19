"use strict";
console.log(
    (function f() {
        return h;
        function g(b) {
            return b || b();
        }
        function h(a) {
            g(a);
            return a;
        }
    })()(42)
);
