//// [parserAccessibilityAfterStatic11.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function Outer() {
        _class_call_check(this, Outer);
    }
    return Outer.public = function() {}, Outer;
}();
