var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function f(a, b) {
    return _f.apply(this, arguments);
}
function _f() {
    _f = _async_to_generator._(function(a, b) {
        var _JSON_parse, _JSON_parse_, tmp, a_;
        return _ts_generator._(this, function(_state) {
            _JSON_parse = _sliced_to_array._(JSON.parse(b), 1), _JSON_parse_ = _JSON_parse[0], tmp = _JSON_parse_.a, a_ = tmp === void 0 ? 1 : tmp;
            return [
                2
            ];
        });
    });
    return _f.apply(this, arguments);
}
