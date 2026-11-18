var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _object_destructuring_empty = require("@swc/helpers/_/_object_destructuring_empty");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
var _to_array = require("@swc/helpers/_/_to_array");
var ref = _object_destructuring_empty._(foo);
var _foo = _sliced_to_array._(foo, 0);
var ref1 = _object_destructuring_empty._(foo.a);
var _foo_a = _sliced_to_array._(foo.a, 0);
var _foo_a1 = foo.a, ref2 = _object_destructuring_empty._(_foo_a1.a);
var _foo1 = _to_array._(foo), _foo_slice = _sliced_to_array._(_foo1.slice(0), 0);
function foo1(param) {
    var ref = _object_destructuring_empty._(param);
}
function foo2(param) {
    var _param = _sliced_to_array._(param, 0);
}
function foo3(param) {
    var ref = _object_destructuring_empty._(param.a);
}
function foo4(param) {
    var _param_a = _sliced_to_array._(param.a, 0);
}
var _foo_a2 = foo.a, a = _foo_a2 === void 0 ? {} : _foo_a2;
var _foo_a3 = foo.a, a = _foo_a3 === void 0 ? [] : _foo_a3;
function foo5(param) {
    var _param_a = param.a, a = _param_a === void 0 ? {} : _param_a;
}
function foo6(param) {
    var _param_a = param.a, a = _param_a === void 0 ? [] : _param_a;
}
try {} catch (param) {
    var ref3 = _object_destructuring_empty._(param);
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(param) {
        var ref = _object_destructuring_empty._(param);
        _class_call_check._(this, A);
    }
    _create_class._(A, [
        {
            key: "method",
            value: function method(param) {
                var ref = _object_destructuring_empty._(param);
            }
        }
    ]);
    return A;
}();
