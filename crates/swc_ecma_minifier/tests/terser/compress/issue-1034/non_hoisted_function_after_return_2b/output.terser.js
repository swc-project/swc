function foo(x) {
    return bar(x ? 1 : 2);
    function bar(x) {
        return 7 - x;
    }
}
