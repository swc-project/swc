"use strict";
function a(a) {
    if (a) {
        return e(1);
        var b = not_called(1);
    } else {
        return e(2);
        var c = not_called(2);
    }
    var d = e(3);
    function e(a) {
        return 7 - a;
    }
    function f() {}
    return c || d;
}
console.log(a(0), a(1));
