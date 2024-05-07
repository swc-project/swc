var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function f() {
    var a = [
        1,
        2,
        3
    ];
    var b = [
        ...a,
        4,
        5
    ];
}
function af() {
    return _af.apply(this, arguments);
}
function _af() {
    _af = _async_to_generator._(function() {
        var a, b;
        return _ts_generator._(this, function(_state) {
            a = [
                1,
                2,
                3
            ];
            b = [
                ...a,
                4,
                5
            ];
            return [
                2
            ];
        });
    });
    return _af.apply(this, arguments);
}
