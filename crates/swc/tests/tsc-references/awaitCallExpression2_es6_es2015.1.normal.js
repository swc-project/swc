import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function func() {
    return _func.apply(this, arguments);
}
function _func() {
    _func = _async_to_generator(function*() {
        before();
        var b = fn((yield p), a, a);
        after();
    });
    return _func.apply(this, arguments);
}
