function a() {
    return a(2) + b();
    function a(a) {
        return a;
    }
    function b() {
        return b();
    }
}
