function o(n, o) {
    var f = n.p;
    o.f();
    return f;
}
var n = {
    p: "PASS",
    f: function() {
        this.p = "FAIL";
    }
};
console.log(o(n, n));
