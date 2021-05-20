"use strict";
var a = 1;
(a.foo += ""), a.foo ? console.log("FAIL") : console.log("PASS");
