"use strict";
var a = "PASS",
    b;
try {
    b = c = 0;
    a = "FAIL";
    b();
} catch (e) {}
console.log(a);
