var r = [
    "a"
];
function o(n) {
    return r.indexOf(n);
}
function t(n) {
    return o(n);
}
function u(n) {
    return o(n);
}
function e(o) {
    var n = o * 2;
    console.log(n);
    return r[n];
}
function n(n) {
    return e(u(n));
}
console.log(n("a"));
