var a = "PASS";
var b = "PASS";
var c = "FAIL";
a ||= "FAIL";
b ??= "FAIL";
c &&= "PASS";
console.log(a, b, c);
