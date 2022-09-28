function n(n, r) {
    var f = n();
    return r.f(f);
}
var r = {
    f: function() {
        return "FAIL";
    }
};
console.log(n(function() {
    r.f = function() {
        return "PASS";
    };
}, r));
