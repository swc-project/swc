var n = ["a"];
function r(r) {
    return n.indexOf(r);
}
function o(n) {
    return r(n);
}
function t(n) {
    return r(n);
}
function u(r) {
    var o = r * 2;
    console.log(o);
    return n[o];
}
function e(n) {
    return u(t(n));
}
console.log(e("a"));
