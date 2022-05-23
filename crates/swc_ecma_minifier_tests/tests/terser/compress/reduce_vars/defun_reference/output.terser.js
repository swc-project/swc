function f() {
    function g() {
        x();
        return a;
    }
    var a = h();
    var b = 2;
    return a + 2;
    function h() {
        y();
        return 2;
    }
}
