var b = [
    "a"
];
function c(a) {
    return b.indexOf(a);
}
function d(a) {
    return c(a);
}
function e(a) {
    return c(a);
}
function f(a) {
    return b[a];
}
function a(a) {
    return f(e(a));
}
console.log(a("a"));
