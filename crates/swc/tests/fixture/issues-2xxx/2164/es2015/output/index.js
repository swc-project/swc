import _async_to_generator from "@swc/helpers/lib/_async_to_generator.js";
function fn() {
    return _fn.apply(this, arguments);
}
function _fn() {
    _fn = _async_to_generator(function*() {
        for(const key in {});
    });
    return _fn.apply(this, arguments);
}
