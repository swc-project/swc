var n = function(r, n, o) {
    return r < n ? r * n + o : r * o - n;
};
var o = function(r, o, a) {
    return n(r, o, a);
};
var r = 0;
for(var a = 0; a < 100; ++a)r += o(a, a + 1, 3 * a);
console.log(r);
