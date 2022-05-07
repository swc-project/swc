var a = "FAIL";
var c = void (a && (a = "PASS"));
console.log(a, typeof c);
