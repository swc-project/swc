//// [computedPropertyNames32_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.bar = function() {
        return 0;
    }, _proto[""] = function() {}, C;
}();
