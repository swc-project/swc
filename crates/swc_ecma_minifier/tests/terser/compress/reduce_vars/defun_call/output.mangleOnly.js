function a() {
    return a() + b(1) - b(a(), 2, 3);
    function a() {
        return 4;
    }
    function b(a) {
        return a;
    }
}
