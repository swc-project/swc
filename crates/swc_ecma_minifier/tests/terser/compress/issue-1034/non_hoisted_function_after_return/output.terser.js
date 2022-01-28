function foo(x) {
    return x ? bar() : baz();
    function bar() {
        return 7;
    }
    function baz() {
        return 8;
    }
}
