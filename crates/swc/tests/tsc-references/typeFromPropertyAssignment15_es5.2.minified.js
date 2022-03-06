import * as swcHelpers from "@swc/helpers";
var inner, Outer = {};
Outer.Inner = (function() {
    "use strict";
    function _class() {
        swcHelpers.classCallCheck(this, _class), this.x = 1;
    }
    return swcHelpers.createClass(_class, [
        {
            key: "m",
            value: function() {}
        }
    ]), _class;
})(), inner.x, inner.m();
var inno = new Outer.Inner();
inno.x, inno.m();
