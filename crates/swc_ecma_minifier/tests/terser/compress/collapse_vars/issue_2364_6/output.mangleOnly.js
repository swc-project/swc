function o(n, o) {
    var r = n.p;
    o.p = "FAIL";
    return r;
}
var n = {
    p: "PASS"
};
console.log(o(n, n));
