var n = [
    "a"
];
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
    var t = r * 2;
    console.log(t);
    return n[t];
}
function e(n) {
    return o(u(n));
}
console.log(e("a"));
