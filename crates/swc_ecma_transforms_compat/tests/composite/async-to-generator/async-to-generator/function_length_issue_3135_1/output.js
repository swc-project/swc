function foo(x, y, ...z) {
    return _async_to_generator(function*() {
        return 42;
    })();
}
