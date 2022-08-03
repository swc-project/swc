var a = "PASS";
var r = "PASS";
var v = "FAIL";
a ||= "FAIL";
r ??= "FAIL";
v &&= "PASS";
console.log(a, r, v);
