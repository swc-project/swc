function n(n, f) {
    var r = n.p;
    f.f();
    return r;
}
var f = {
    p: "PASS",
    f: function() {
        this.p = "FAIL";
    }
};
console.log(n(f, f));
