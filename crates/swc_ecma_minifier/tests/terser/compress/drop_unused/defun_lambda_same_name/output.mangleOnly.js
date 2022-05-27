function a(b) {
    return b ? b * a(b - 1) : 1;
}
console.log((function b(a) {
    return a ? a * b(a - 1) : 1;
})(5));
