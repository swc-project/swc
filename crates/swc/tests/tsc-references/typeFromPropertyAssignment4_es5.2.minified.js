import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var local, x, Outer = {};
Outer.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class), this.y = 12;
}, local.y, new Outer.Inner().y, x.y, new Outer.Inner().y;
