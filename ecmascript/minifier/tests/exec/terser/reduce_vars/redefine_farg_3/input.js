function f(a) {
    var a;
    return typeof a;
}
function g(a) {
    var a = 42;
    return typeof a;
}
function h(a, b) {
    var a = b;
    return typeof a;
}
console.log(f([]), g([]), h([]));
