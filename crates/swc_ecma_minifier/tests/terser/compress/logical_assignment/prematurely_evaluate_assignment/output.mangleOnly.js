var S = null;
var l = null;
var A = "FAIL";
S ||= "PASS";
l ??= "PASS";
A &&= "PASS";
console.log(S, l, A);
