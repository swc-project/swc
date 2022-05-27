function b(a, b, c) {
    var d = a[(b.f = function() {
        return "PASS";
    })];
    return c.f(d);
}
var a = {
    f: function() {
        return "FAIL";
    }
};
console.log(b({}, a, a));
