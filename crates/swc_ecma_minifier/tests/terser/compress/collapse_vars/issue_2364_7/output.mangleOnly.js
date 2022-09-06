function n(n, o) {
    var f = n.p;
    o.f();
    return f;
}
var o = {
    p: "PASS",
    f: function () {
        this.p = "FAIL";
    },
};
console.log(n(o, o));
