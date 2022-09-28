function n() {
    return n;
    var n;
}
function r() {
    return n;
    var n = 1;
}
console.log(n(), r());
