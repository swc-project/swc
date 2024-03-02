function f() {
    function g() {
        x();
        return a;
    }
    var a = (y(), 2);
    var b = 2;
    return a + 2;
}
