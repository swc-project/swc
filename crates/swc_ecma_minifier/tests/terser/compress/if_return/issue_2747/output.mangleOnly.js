"use strict";
function e(e) {
    if (e === 0) {
        return null;
    }
    let l;
    if (e > 2) {
        l = 4;
    } else {
        l = 5;
    }
    return l;
}
console.log(e(0), e(1), e(3));
