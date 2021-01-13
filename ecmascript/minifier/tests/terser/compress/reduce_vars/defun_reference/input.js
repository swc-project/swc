function f() {
    function g() {
        x();
        return a;
    }
    var a = h();
    var b = 2;
    return a + b;
    function h() {
        y();
        return b;
    }
}
