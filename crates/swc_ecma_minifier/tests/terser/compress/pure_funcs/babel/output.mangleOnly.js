function a(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
}
var b = function b() {
    a(this, b);
};
