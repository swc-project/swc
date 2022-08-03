function r(r, n, o) {
    return r < n ? r * n + o : r * o - n;
}
function n(n, o, t) {
    return r(n, o, t);
}
var o = 0;
for(var t = 0; t < 100; ++t){
    o += n(t, t + 1, 3 * t);
}
console.log(o);
