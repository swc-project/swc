import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function f() {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function*() {
        yield a;
    });
    return _f.apply(this, arguments);
}
