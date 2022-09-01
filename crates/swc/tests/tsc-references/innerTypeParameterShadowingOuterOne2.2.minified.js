//// [innerTypeParameterShadowingOuterOne2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.g = function() {
        (void 0).toFixed();
    }, _proto.h = function() {
        (void 0).getDate();
    }, C;
}();
