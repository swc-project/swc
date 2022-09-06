function n(n, o) {
    var r = n.p;
    o.p = "FAIL";
    return r;
}
var o = { p: "PASS" };
console.log(n(o, o));
