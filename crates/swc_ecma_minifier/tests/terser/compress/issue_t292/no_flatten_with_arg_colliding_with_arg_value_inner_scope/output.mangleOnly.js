var n = ["a"];
function r(r) {
    return n.indexOf(r);
}
function t(n) {
    return r(n);
}
function u(n) {
    return r(n);
}
function o(r) {
    return n[r];
}
function e(n) {
    return o(u(n));
}
console.log(e("a"));
