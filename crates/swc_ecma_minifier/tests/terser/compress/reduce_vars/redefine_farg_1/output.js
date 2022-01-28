function f(a) {
    return typeof a;
}
function g() {
    return "number";
}
function h(a, b) {
    a = b;
    return typeof a;
}
console.log(f([]), g([]), h([]));
