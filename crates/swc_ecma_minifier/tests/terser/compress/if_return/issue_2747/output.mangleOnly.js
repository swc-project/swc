"use strict";
function e(e) {
    if (e === 0) {
        return null;
    }
    let t;
    if (e > 2) {
        t = 4;
    } else {
        t = 5;
    }
    return t;
}
console.log(e(0), e(1), e(3));
