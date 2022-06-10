function b(a, b) {
    var c = a.p;
    b.f();
    return c;
}
var a = {
    p: "PASS",
    f: function() {
        this.p = "FAIL";
    }
};
console.log(b(a, a));
