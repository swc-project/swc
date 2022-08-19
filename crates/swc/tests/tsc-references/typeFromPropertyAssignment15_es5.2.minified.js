import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var inner, Outer = {};
Outer.Inner = function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class), this.x = 1;
    }
    var _proto = _class.prototype;
    return _proto.m = function() {}, _class;
}(), inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
