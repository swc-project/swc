function n(n, r, o) {
    function t(n, r, o) {
        return n < r ? n * r + o : n * o - r;
    }
    return t(n, r, o);
}
var r = 0;
for (var o = 0; o < 100; ++o) {
    r += n(o, o + 1, 3 * o);
}
console.log(r);
