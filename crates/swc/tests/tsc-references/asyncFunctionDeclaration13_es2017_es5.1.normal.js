// @target: es2017
// @noEmitHelpers: true
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator(function() {
        var v;
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
