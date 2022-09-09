"use strict";
function n() {
    return { a: true };
}
console.log(
    (function (t) {
        t = false;
        return n();
    })().a,
    n.call().a
);
