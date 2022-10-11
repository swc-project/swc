function f() {
    function g() {
        x();
        return a;
    }
    var a = function() {
        y();
        return 2;
    }();
    var b = 2;
    return a + 2;
}
