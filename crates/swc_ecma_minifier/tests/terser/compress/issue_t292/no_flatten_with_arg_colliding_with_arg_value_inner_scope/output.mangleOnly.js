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
function e(r) {
    return n[r];
}
function f(n) {
    return e(u(n));
}
console.log(f("a"));
