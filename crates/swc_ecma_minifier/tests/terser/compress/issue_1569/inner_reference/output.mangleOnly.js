!(function a(b) {
    return b && a(b - 1) + b;
})(42);
!(function a(b) {
    return b;
})(42);
