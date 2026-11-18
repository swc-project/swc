var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
function foo(a, b, param) {
    var _param = _sliced_to_array._(param, 1), a = _param[0];
    function bar(c, d) {
        for(var _len = arguments.length, d = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
            d[_key - 2] = arguments[_key];
        }
        function baz(param, f, param1) {
            var e = param.e, _param_f = _sliced_to_array._(param1.f, 1), e = _param_f[0];
        }
    }
}
