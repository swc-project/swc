"use strict";
function n() {
    return {
        a: true
    };
}
console.log((function(a) {
    a = false;
    return n();
})().a, n.call().a);
