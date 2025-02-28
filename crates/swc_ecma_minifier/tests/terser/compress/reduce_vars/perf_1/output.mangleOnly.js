function r(n, r, o) {
    return n < r ? n * r + o : n * o - r;
}
function o(n, o, t) {
    return r(n, o, t);
}
var n = 0;
for(var t = 0; t < 100; ++t){
    n += o(t, t + 1, 3 * t);
}
console.log(n);
