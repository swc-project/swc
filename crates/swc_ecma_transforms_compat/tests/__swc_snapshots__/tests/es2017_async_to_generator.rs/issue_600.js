function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function*() {
        for (let a of b){}
    });
    return _foo.apply(this, arguments);
}
