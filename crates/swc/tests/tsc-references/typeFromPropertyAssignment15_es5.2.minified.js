import * as swcHelpers from "@swc/helpers";
var inner, Outer = {};
Outer.Inner = function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class), this.x = 1;
    }
    return _class.prototype.m = function() {}, _class;
}(), inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
