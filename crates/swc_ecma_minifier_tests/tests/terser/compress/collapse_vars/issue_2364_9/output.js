function f(a, b) {
    var d = a();
    return b.f(d);
}
var o = {
    f: function () {
        return "FAIL";
    },
};
console.log(
    f(function () {
        o.f = function () {
            return "PASS";
        };
    }, o)
);
