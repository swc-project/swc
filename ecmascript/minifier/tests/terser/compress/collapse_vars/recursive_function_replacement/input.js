function f(a) {
    return x(g(a));
}
function g(a) {
    return y(f(a));
}
console.log(f(c));
