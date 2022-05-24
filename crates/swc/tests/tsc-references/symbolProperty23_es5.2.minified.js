import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var _toPrimitive = Symbol.toPrimitive, C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype[_toPrimitive] = function() {
        return !0;
    }, C;
}();
