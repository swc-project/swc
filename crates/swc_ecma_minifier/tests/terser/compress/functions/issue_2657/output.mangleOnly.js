"use strict";
console.log((function n() {
    return r;
    function t(n) {
        return n || n();
    }
    function r(n) {
        t(n);
        return n;
    }
})()(42));
