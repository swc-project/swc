var A = "PASS";
var S = "PASS";
var a = "FAIL";
A ||= "FAIL";
S ??= "FAIL";
a &&= "PASS";
console.log(A, S, a);
