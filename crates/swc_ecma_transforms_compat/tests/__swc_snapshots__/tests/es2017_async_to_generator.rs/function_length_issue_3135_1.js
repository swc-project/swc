function foo(x, y) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(x, y, ...z) {
        return 42;
    });
    return _foo.apply(this, arguments);
}
