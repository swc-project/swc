function n(n, r, f) {
    var o =
        n[
            (r.f = function () {
                return "PASS";
            })
        ];
    return f.f(o);
}
var r = {
    f: function () {
        return "FAIL";
    },
};
console.log(n({}, r, r));
