import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _throw from "@swc/helpers/src/_throw.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        var tmp, ref, ref;
        return _ts_generator(this, function(_state) {
            tmp = baz.bar, ref = tmp === void 0 ? {} : tmp, ref = ref !== null ? ref : _throw(new TypeError("Cannot destructure undefined"));
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
