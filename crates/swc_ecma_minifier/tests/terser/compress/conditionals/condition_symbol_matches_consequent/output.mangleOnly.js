function n(n, r) {
    return n ? n : r;
}
function r() {
    return u ? u : e;
}
var u = 4;
var e = 5;
console.log(n(3, null), n(0, 7), n(true, false), r());
