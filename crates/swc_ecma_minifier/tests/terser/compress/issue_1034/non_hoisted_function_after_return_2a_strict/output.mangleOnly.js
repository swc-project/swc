"use strict";
function r(r) {
    if (r) {
        return e(1);
        var n = not_called(1);
    } else {
        return e(2);
        var t = not_called(2);
    }
    var u = e(3);
    function e(r) {
        return 7 - r;
    }
    function i() {}
    return t || u;
}
console.log(r(0), r(1));
