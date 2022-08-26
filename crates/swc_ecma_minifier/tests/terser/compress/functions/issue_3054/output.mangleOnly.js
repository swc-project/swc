"use strict";
function t() {
    return {
        a: true
    };
}
console.log((function(n) {
    n = false;
    return t();
})().a, t.call().a);
