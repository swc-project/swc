test(function foo() {
    foo = function foo(x) {
        return x === 0 ? 1 : 1 + foo(x - 1);
    };
    return foo(10);
});
