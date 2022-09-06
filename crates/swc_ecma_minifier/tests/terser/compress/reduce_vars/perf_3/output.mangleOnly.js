var r = function (r, n, o) {
    return r < n ? r * n + o : r * o - n;
};
var n = function (n, o, a) {
    return r(n, o, a);
};
var o = 0;
for (var a = 0; a < 100; ++a) o += n(a, a + 1, 3 * a);
console.log(o);
