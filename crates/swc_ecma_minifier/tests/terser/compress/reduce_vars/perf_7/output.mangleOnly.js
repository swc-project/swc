var r = function(r, n, a) {
    var o = function(r, n, a) {
        return r < n ? r * n + a : r * a - n;
    };
    return o(r, n, a);
};
var n = 0;
for(var a = 0; a < 100; ++a)n += r(a, a + 1, 3 * a);
console.log(n);
