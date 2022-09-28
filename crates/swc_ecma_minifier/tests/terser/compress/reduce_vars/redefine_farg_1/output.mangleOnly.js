function n(n) {
    var n;
    return typeof n;
}
function o(n) {
    var n = 42;
    return typeof n;
}
function r(n, o) {
    var n = o;
    return typeof n;
}
console.log(n([]), o([]), r([]));
