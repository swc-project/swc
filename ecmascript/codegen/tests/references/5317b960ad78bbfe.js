function a(b, c) {
    // circular reference
    function d() {
        return e();
    }
    function e() {
        return d();
    }
    return b + c;
}
