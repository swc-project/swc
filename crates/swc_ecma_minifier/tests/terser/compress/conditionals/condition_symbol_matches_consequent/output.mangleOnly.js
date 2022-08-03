function n(n, r) {
    return n ? n : r;
}
function r() {
    return u ? u : t;
}
var u = 4;
var t = 5;
console.log(n(3, null), n(0, 7), n(true, false), r());
