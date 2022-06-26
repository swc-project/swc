var a = [
    "a"
];
function b(b) {
    return a.indexOf(b);
}
function c(a) {
    return b(a);
}
function d(a) {
    return b(a);
}
function e(b) {
    var c = b * 2;
    console.log(c);
    return a[c];
}
function f(a) {
    return e(d(a));
}
console.log(f("a"));
