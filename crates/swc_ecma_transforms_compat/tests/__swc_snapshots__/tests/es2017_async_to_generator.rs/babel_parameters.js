function foo(bar) {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*(bar) {});
    return _foo.apply(this, arguments);
}
