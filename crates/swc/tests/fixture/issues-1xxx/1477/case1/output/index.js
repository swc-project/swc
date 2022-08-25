import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f(a, b) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function(a, b) {
        var ref, ref1, tmp, a_;
        return _ts_generator(this, function(_state) {
            ref = _sliced_to_array(JSON.parse(b), 1), ref1 = ref[0], tmp = ref1.a, a_ = tmp === void 0 ? 1 : tmp;
            return [
                2
            ];
        });
    });
    return _f.apply(this, arguments);
}
