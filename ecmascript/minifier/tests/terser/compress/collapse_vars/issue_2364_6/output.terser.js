function f(a, b) {
    var c = a.p;
    b.p = "FAIL";
    return c;
}
var o = { p: "PASS" };
console.log(f(o, o));
