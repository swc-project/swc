"use strict";
function f(baz) {
    if (baz === 0) {
        return null;
    }
    let r;
    if (baz > 2) {
        r = 4;
    } else {
        r = 5;
    }
    return r;
}
console.log(f(0), f(1), f(3));
