var l = null;
var a = null;
var r = "FAIL";
l ||= "PASS";
a ??= "PASS";
r &&= "PASS";
console.log(l, a, r);
