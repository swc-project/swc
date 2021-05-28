function f() {
    function g() {
        return x();
    }
    var a = g();
    return a(42);
}
