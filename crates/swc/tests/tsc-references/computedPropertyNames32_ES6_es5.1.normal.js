import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: es6
function foo() {
    return "";
}
var tmp = foo();
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.bar = function bar() {
        return 0;
    };
    _proto[tmp] = function() {};
    return C;
}();
