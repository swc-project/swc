import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @Filename: def.js
var Outer = {};
// @Filename: a.js
Outer.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class);
    /** @type {number} */ this.y = 12;
};
/** @type {Outer.Inner} */ var local;
local.y;
var inner = new Outer.Inner();
inner.y;
// @Filename: b.js
/** @type {Outer.Inner} */ var x;
x.y;
var z = new Outer.Inner();
z.y;
