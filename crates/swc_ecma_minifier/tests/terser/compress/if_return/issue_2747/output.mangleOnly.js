"use strict";
function a(b) {
    if (b === 0) {
        return null;
    }
    let a;
    if (b > 2) {
        a = 4;
    } else {
        a = 5;
    }
    return a;
}
console.log(a(0), a(1), a(3));
