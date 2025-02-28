var r = [
    "a"
];
function t(n) {
    return r.indexOf(n);
}
function u(n) {
    return t(n);
}
function o(n) {
    return t(n);
}
function e(n) {
    return r[n];
}
function n(n) {
    return e(o(n));
}
console.log(n("a"));
