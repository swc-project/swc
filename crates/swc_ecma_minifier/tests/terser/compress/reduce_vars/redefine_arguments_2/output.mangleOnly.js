function n() {
    var arguments;
    return typeof arguments;
}
function r() {
    var arguments = 42;
    return typeof arguments;
}
function t(n) {
    var arguments = n;
    return typeof arguments;
}
console.log(n(), r(), t());
