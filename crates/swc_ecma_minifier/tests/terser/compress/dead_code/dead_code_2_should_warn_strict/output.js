"use strict";
function f() {
    var x, g1;
    g();
    x = 10;
    throw Error("foo");
}
f();
