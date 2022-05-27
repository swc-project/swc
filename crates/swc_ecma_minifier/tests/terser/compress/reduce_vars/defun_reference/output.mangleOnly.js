function a() {
    function c() {
        x();
        return a;
    }
    var a = d();
    var b = 2;
    return a + b;
    function d() {
        y();
        return b;
    }
}
