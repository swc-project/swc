import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
        this["hello"] = 10;
        this[0b110] = "world";
        this[0o23534] = "WORLD";
        this[20] = "twenty";
    }
    var _proto = B.prototype;
    _proto["foo"] = function foo() {};
    _proto[0b1110] = function() {};
    _proto[11] = function() {};
    _proto.interface = function _interface() {};
    return B;
}();
B["hi"] = 10000;
B[22] = "twenty-two";
B[0b101] = "binary";
B[0o3235] = "octal";
