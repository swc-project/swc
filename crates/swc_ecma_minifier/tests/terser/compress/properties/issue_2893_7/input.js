"use strict";
var o = {
    get a() {
        return "PASS";
    },
};
o.a = "FAIL";
console.log(o.a);
