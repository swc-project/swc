import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: es6
var B = /*#__PURE__*/ function() {
    "use strict";
    function B() {
        _class_call_check(this, B);
        this["hello"] = 10;
        this[6] = "world";
        this[10076] = "WORLD";
        this[20] = "twenty";
    }
    var _proto = B.prototype;
    _proto["foo"] = function foo() {};
    _proto[14] = function() {};
    _proto[11] = function() {};
    _proto.interface = function _interface() {};
    return B;
}();
B["hi"] = 10000;
B[22] = "twenty-two";
B[5] = "binary";
B[1693] = "octal";
