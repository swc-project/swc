"use strict";
function f(baz) {
    if (0 === baz) return null;
    let r;
    return (r = baz > 2 ? 4 : 5), r;
}
console.log(f(0), f(1), f(3));
