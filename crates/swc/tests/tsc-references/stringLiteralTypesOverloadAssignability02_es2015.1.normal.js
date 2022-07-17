// @declaration: true
function f(x) {
    return 0;
}
function g(x) {
    return 0;
}
let a = f;
let b = g;
a = b;
b = a;
