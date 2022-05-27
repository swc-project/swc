import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
//@target: ES5
var Symbol;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[Symbol.iterator] = function() {};
    return C;
}();
(new C)[Symbol.iterator];
