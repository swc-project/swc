function n(n, a) {
    if (!(n instanceof a))
        throw new TypeError("Cannot call a class as a function");
}
var a = function a() {
    n(this, a);
};
