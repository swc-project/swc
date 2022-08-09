function r(r, n) {
    var p = r.p;
    n.p = "FAIL";
    return p;
}
var n = {
    p: "PASS"
};
console.log(r(n, n));
