var r = function(r) {
    var n = function(r, n) {
        return r + n;
    };
    var t = function(r) {
        return r.reduce(n, 0);
    };
    var u = function(r) {
        return t(r);
    };
    r.baz = function(n) {
        var r = u(n);
        return (r.get = 1), r;
    };
    return r;
};
var n = r({});
console.log(n.baz([
    1,
    2,
    3
]));
