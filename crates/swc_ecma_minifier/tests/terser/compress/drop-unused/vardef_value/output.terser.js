function f() {
    var a = (function () {
        return x();
    })();
    return a(42);
}
