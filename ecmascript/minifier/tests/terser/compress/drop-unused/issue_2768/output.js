var a = "FAIL";
var c = ((d = a), void (d && (a = "PASS")));
var d;
console.log(a, typeof c);
