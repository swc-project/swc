//// [parserAccessibilityAfterStatic3.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Outer = function Outer() {
    "use strict";
    _class_call_check(this, Outer);
};
(function() {
    Outer.public = 1;
})();
