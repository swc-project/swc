"use strict";
function n(n) {
    if (n) {
        return o(1);
        var r = not_called(1);
    } else {
        return o(2);
        var t = not_called(2);
    }
    var e = o(3);
    function o(n) {
        return 7 - n;
    }
    function u() {}
    return t || e;
}
console.log(n(0), n(1));
