function f(a, b, c) {
    var d =
        a[
            (b.f = function () {
                return "PASS";
            })
        ];
    return c.f(d);
}
var o = {
    f: function () {
        return "FAIL";
    },
};
console.log(f({}, o, o));
