function a(a, b) {
    function c() {
        return d();
    }
    function d() {
        return c();
    }
    return a + b;
}
