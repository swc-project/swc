let obj = {
    a: 123,
    foo (bar) {
        return _async_to_generator(function*() {
            return yield baz(bar);
        })();
    }
};
