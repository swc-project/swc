"use strict";
console.log((function n() {
    return t;
    function r(n) {
        return n || n();
    }
    function t(n) {
        r(n);
        return n;
    }
})()(42));
