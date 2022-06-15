function a(b) {
    return b ? b * a(b - 1) : 1;
}
console.log((function a(b) {
    return b ? b * a(b - 1) : 1;
})(5));
