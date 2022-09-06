"use strict";
var s = {
    set a(s) {
        this.b = s;
    },
    b: "FAIL",
};
s.a = "PASS";
console.log(s.b);
