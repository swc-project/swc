var o = "FAIL";
var a = {};
a[(o = "PASS")] ||= 1;
console.log(o);
