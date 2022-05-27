"use strict";
function a() {
    return {
        a: true
    };
}
console.log((function(b) {
    b = false;
    return a();
})().a, a.call().a);
