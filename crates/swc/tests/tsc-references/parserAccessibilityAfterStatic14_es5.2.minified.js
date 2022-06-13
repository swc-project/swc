import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var Outer = function() {
    "use strict";
    function Outer() {
        _class_call_check(this, Outer);
    }
    return Outer.public = function() {}, Outer;
}();
