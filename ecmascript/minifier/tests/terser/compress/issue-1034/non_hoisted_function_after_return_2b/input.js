function foo(x) {
    if (x) {
        return bar(1);
    } else {
        return bar(2);
        var b;
    }
    var c = bar(3);
    function bar(x) {
        return 7 - x;
    }
    return b || c;
}
