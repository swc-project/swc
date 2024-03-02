function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {
        var wat = yield bar();
    });
    return _foo.apply(this, arguments);
}
