function n(n, r, o) {
    return n < r ? n * r + o : n * o - r;
}
function r(r, o, t) {
    return n(r, o, t);
}
var o = 0;
for (var t = 0; t < 100; ++t) {
    o += r(t, t + 1, 3 * t);
}
console.log(o);
