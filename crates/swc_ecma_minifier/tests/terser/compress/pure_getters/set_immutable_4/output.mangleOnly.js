"use strict";
var o = 1;
o.foo += "";
if (o.foo) console.log("FAIL");
else console.log("PASS");
