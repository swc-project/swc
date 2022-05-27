"use strict";
console.log((function a() {
    return c;
    function b(a) {
        return a || a();
    }
    function c(a) {
        b(a);
        return a;
    }
})()(42));
