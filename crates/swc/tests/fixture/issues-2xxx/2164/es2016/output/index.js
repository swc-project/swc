import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function*() {
        for(const key in {});
    });
    return _fn.apply(this, arguments);
}
