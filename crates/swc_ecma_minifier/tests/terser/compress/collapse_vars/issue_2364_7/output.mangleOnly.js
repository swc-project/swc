function a(a, b) {
    var c = a.p;
    b.f();
    return c;
}
var b = {
    p: "PASS",
    f: function() {
        this.p = "FAIL";
    }
};
console.log(a(b, b));
