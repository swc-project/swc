var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
function f1() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 5, b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 6, c = arguments.length > 2 ? arguments[2] : void 0;
}
function f2() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 5, b = arguments.length > 1 ? arguments[1] : void 0, c = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 5;
}
var f3 = function f3() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 5, b = arguments.length > 1 ? arguments[1] : void 0;
    for(var _len = arguments.length, c = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++){
        c[_key - 2] = arguments[_key];
    }
};
var f4 = function f(a) {
    var b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 5, c = arguments.length > 2 ? arguments[2] : void 0;
};
var f5 = function f5() {
    var a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 5, b = (arguments.length > 1 ? arguments[1] : void 0).b;
};
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        var a = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).a, b = arguments.length > 1 ? arguments[1] : void 0;
        _class_call_check._(this, C);
    }
    _create_class._(C, [
        {
            key: "f",
            value: function f() {
                var _ref = _sliced_to_array._(arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [
                    1,
                    2
                ], 2), a = _ref[0], b = _ref[1], c = arguments.length > 1 ? arguments[1] : void 0;
            }
        }
    ]);
    return C;
}();
