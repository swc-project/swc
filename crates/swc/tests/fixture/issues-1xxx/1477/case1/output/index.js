import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
function f(a, b) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator(function(a, b) {
        var _JSON_parse, _JSON_parse_, tmp, a_;
        return _ts_generator(this, function(_state) {
            _JSON_parse = _sliced_to_array(JSON.parse(b), 1), _JSON_parse_ = _JSON_parse[0], tmp = _JSON_parse_.a, a_ = tmp === void 0 ? 1 : tmp;
            return [
                2
            ];
        });
    });
    return _f.apply(this, arguments);
}
