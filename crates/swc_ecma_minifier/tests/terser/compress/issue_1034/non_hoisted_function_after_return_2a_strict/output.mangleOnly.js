"use strict";
function n(n) {
    if (n) {
        return e(1);
        var o = not_called(1);
    } else {
        return e(2);
        var r = not_called(2);
    }
    var t = e(3);
    function e(n) {
        return 7 - n;
    }
    function u() {}
    return r || t;
}
console.log(n(0), n(1));
