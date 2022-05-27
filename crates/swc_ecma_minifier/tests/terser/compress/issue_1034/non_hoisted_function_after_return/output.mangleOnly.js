function a(a) {
    if (a) {
        return b();
        not_called1();
    } else {
        return d();
        not_called2();
    }
    function b() {
        return 7;
    }
    return not_reached;
    function c() {}
    function d() {
        return 8;
    }
}
