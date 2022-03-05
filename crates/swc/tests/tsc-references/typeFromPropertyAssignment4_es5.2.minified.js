import * as swcHelpers from "@swc/helpers";
var local, x, Outer = {};
Outer.Inner = function _class() {
    "use strict";
    swcHelpers.classCallCheck(this, _class), this.y = 12;
}, local.y, new Outer.Inner().y, x.y, new Outer.Inner().y;
