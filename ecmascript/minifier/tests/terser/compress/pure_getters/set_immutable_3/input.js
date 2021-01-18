"use strict";
var a = 1;
a.foo += "";
if (a.foo) console.log("FAIL");
else console.log("PASS");
