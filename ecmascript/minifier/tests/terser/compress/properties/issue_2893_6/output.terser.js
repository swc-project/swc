"use strict";
var o = {
    set a(v) {
        this.b = v;
    },
    b: "FAIL",
};
o.a = "PASS";
console.log(o.b);
