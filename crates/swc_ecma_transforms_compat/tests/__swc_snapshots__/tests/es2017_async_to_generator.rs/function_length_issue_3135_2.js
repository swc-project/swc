function foo(x, y, ...z) {
    return _wrap_async_generator(function*() {
        return 42;
    })();
}
