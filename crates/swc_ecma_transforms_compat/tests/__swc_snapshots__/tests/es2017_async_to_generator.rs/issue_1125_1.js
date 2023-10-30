function test() {
    return _test.apply(this, arguments);
}
function _test() {
    _test = _async_to_generator(function*() {
        try {
            yield 1;
        } finally{
            console.log(2);
        }
    });
    return _test.apply(this, arguments);
}
test();
