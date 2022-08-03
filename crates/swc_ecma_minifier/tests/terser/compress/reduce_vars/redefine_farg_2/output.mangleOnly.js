function n(n) {
    var n;
    return typeof n;
}
function r(n) {
    var n = 42;
    return typeof n;
}
function t(n, r) {
    var n = r;
    return typeof n;
}
console.log(n([]), r([]), t([]));
