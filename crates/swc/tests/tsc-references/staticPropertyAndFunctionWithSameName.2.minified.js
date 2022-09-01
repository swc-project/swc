//// [staticPropertyAndFunctionWithSameName.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    return D.prototype.f = function() {}, D;
}();
