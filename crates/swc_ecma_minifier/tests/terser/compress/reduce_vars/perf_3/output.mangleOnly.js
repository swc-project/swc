var r = function(r, n, a) {
    return r < n ? r * n + a : r * a - n;
};
var n = function(n, a, o) {
    return r(n, a, o);
};
var a = 0;
for(var o = 0; o < 100; ++o)a += n(o, o + 1, 3 * o);
console.log(a);
