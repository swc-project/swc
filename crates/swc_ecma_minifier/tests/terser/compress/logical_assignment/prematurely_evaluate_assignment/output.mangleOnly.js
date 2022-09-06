var l = null;
var S = null;
var A = "FAIL";
l ||= "PASS";
S ??= "PASS";
A &&= "PASS";
console.log(l, S, A);
