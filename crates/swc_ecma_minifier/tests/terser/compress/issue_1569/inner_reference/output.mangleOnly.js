!(function b(a) {
    return a && b(a - 1) + a;
})(42);
!(function b(a) {
    return a;
})(42);
