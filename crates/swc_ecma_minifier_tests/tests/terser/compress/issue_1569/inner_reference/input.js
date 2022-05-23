!(function f(a) {
    return a && f(a - 1) + a;
})(42);
!(function g(a) {
    return a;
})(42);
