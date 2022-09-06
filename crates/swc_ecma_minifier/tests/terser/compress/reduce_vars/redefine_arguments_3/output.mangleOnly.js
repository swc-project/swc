function n() {
    var arguments;
    return typeof arguments;
}
function o() {
    var arguments = 42;
    return typeof arguments;
}
function r(n) {
    var arguments = n;
    return typeof arguments;
}
console.log(n(), o(), r());
