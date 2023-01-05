"use strict";
function f() {
    var x, g;
    g();
    x = 10;
    throw Error("foo");
}
f();
