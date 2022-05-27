function a(a) {
    if (a) {
        return e(1);
        var d = not_called(1);
    } else {
        return e(2);
        var b = not_called(2);
    }
    var c = e(3);
    function e(a) {
        return 7 - a;
    }
    function f() {}
    return b || c;
}
