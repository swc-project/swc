function r(n, r, o) {
    function t(n, r, o) {
        return n < r ? n * r + o : n * o - r;
    }
    return t(n, r, o);
}
var n = 0;
for(var o = 0; o < 100; ++o){
    n += r(o, o + 1, 3 * o);
}
console.log(n);
