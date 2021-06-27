function f(a, b) {
    var c = a.p;
    b.f();
    return c;
}
var o = {
    p: "PASS",
    f: function () {
        this.p = "FAIL";
    },
};
console.log(f(o, o));
