var local;
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
Outer.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class), this.y = 12;
}, local.y, new Outer.Inner().y;
(void 0).y, new Outer.Inner().y;
