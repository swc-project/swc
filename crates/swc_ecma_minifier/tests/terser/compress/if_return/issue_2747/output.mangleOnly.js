"use strict";
function a(a) {
    if (a === 0) {
        return null;
    }
    let b;
    if (a > 2) {
        b = 4;
    } else {
        b = 5;
    }
    return b;
}
console.log(a(0), a(1), a(3));
