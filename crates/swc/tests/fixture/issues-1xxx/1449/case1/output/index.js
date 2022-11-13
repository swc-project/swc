import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_destructuring_empty from "@swc/helpers/src/_object_destructuring_empty.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        var tmp, ref;
        return _ts_generator(this, function(_state) {
            tmp = baz.bar, ref = _object_destructuring_empty(tmp === void 0 ? {} : tmp);
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
