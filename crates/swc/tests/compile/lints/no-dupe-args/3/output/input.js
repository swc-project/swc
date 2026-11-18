var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
function foo(a, b, param) {
    var _param = _sliced_to_array._(param, 1), a = _param[0];
}
function bar(a, b) {
    for(var _len = arguments.length, a = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        a[_key - 2] = arguments[_key];
    }
}
function baz(param, b, param1) {
    var a = param.a, _param_c = _sliced_to_array._(param1.c, 1), a = _param_c[0];
}
