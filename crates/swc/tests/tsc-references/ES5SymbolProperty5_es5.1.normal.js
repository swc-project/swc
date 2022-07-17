//@target: ES5
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
(new C)[Symbol.iterator](0) // Should error
;
