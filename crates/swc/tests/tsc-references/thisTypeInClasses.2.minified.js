//// [thisTypeInClasses.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function C1() {
        _class_call_check(this, C1);
    }
    return C1.prototype.f = function(x) {}, C1;
}();
