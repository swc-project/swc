function a() {
    function a(a) {
        return a;
    }
    function b() {
        return b();
    }
    return a(2) + b();
}
