import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var inner, Outer = {};
Outer.Inner = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), this.x = 1;
    }
    return _class.prototype.m = function() {}, _class;
}(), inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
