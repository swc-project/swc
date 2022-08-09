"use strict";
function n(n) {
    if (n) {
        return r();
        not_called1();
    } else {
        return u();
        not_called2();
    }
    function r() {
        return 7;
    }
    return not_reached;
    function t() {}
    function u() {
        return 8;
    }
}
console.log(n(0), n(1));
