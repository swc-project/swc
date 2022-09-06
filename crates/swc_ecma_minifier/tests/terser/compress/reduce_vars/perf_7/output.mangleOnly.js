var r = function (r, n, o) {
    var a = function (r, n, o) {
        return r < n ? r * n + o : r * o - n;
    };
    return a(r, n, o);
};
var n = 0;
for (var o = 0; o < 100; ++o) n += r(o, o + 1, 3 * o);
console.log(n);
