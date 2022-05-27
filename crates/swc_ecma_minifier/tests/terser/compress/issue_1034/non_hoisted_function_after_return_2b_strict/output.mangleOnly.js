"use strict";
function a(a) {
    if (a) {
        return d(1);
    } else {
        return d(2);
        var b;
    }
    var c = d(3);
    function d(a) {
        return 7 - a;
    }
    return b || c;
}
console.log(a(0), a(1));
