"use strict";
console.log((function n() {
    return n;
    function t(n) {
        return n || n();
    }
    function n(n) {
        t(n);
        return n;
    }
})()(42));
