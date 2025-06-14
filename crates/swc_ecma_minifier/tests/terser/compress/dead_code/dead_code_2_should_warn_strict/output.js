"use strict";
function f() {
    g();
    throw Error("foo");
}
f();
