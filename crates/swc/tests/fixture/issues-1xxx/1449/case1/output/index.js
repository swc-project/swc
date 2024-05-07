var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _object_destructuring_empty = require("@swc/helpers/_/_object_destructuring_empty");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function foo() {
    return _foo.apply(this, arguments);
}
function _foo() {
    _foo = _async_to_generator._(function() {
        var tmp, ref;
        return _ts_generator._(this, function(_state) {
            tmp = baz.bar, ref = _object_destructuring_empty._(tmp === void 0 ? {} : tmp);
            return [
                2
            ];
        });
    });
    return _foo.apply(this, arguments);
}
