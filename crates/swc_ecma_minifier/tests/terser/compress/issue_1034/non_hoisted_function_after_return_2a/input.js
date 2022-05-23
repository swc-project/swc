function foo(x) {
    if (x) {
        return bar(1);
        var a = not_called(1);
    } else {
        return bar(2);
        var b = not_called(2);
    }
    var c = bar(3);
    function bar(x) {
        return 7 - x;
    }
    function nope() {}
    return b || c;
}
