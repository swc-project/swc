import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var Outer = function() {
    "use strict";
    function Outer() {
        _class_call_check(this, Outer);
    }
    return Outer.public = function() {}, Outer;
}();
