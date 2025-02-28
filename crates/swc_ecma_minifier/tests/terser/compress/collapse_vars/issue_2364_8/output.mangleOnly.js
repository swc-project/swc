function r(n, r, f) {
    var o = n[(r.f = function() {
        return "PASS";
    })];
    return f.f(o);
}
var n = {
    f: function() {
        return "FAIL";
    }
};
console.log(r({}, n, n));
