function n(n, r, f) {
    var t = n[(r.f = function() {
        return "PASS";
    })];
    return f.f(t);
}
var r = {
    f: function() {
        return "FAIL";
    }
};
console.log(n({}, r, r));
