const foo = function(x, y, ...z) {
    return _async_to_generator(function*() {
        return 42;
    })();
};
