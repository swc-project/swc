// @target: es5
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    return "";
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[foo()] = function() {};
    return C;
}();
