const foo = function foo(x, y, ...z) {
    return _async_to_generator(function*() {
        if (x) {
            return foo(0, y);
        }
        return 0;
    })();
};
