var a = null;
var b = null;
var c = "FAIL";
a ||= "PASS";
b ??= "PASS";
c &&= "PASS";
console.log(a, b, c);
