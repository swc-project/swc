"use strict";
function f() {
    return { a: true };
}
console.log(
    (function (b) {
        b = false;
        return f();
    })().a,
    f.call().a
);
