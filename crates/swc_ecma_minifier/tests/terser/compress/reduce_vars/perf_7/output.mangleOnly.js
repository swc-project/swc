var n = function(r, n, o) {
    var a = function(r, n, o) {
        return r < n ? r * n + o : r * o - n;
    };
    return a(r, n, o);
};
var r = 0;
for(var o = 0; o < 100; ++o)r += n(o, o + 1, 3 * o);
console.log(r);
