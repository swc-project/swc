function a(a, b, c) {
    var d = a[(b.f = function() {
        return "PASS";
    })];
    return c.f(d);
}
var b = {
    f: function() {
        return "FAIL";
    }
};
console.log(a({}, b, b));
