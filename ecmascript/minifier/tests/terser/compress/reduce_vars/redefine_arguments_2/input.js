function f() {
    var arguments;
    return typeof arguments;
}
function g() {
    var arguments = 42;
    return typeof arguments;
}
function h(x) {
    var arguments = x;
    return typeof arguments;
}
console.log(f(), g(), h());
