//// [comparisonOperatorWithIdenticalObjects.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function A1() {
        _class_call_check(this, A1);
    }
    return A1.prototype.fn = function(a) {
        return null;
    }, A1;
}();
