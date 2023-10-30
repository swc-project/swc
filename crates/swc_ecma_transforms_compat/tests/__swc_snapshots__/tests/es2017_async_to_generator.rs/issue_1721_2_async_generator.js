function lol() {
    return _lol.apply(this, arguments);
}
function _lol() {
    _lol = _wrap_async_generator(function*() {
        yield 1;
        yield 2;
    });
    return _lol.apply(this, arguments);
}
