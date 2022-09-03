//// [typeFromPropertyAssignment4.ts]
//// [def.js]
var Outer = {};
//// [a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
Outer.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class), this.y = 12;
}, local.y;
var local, inner = new Outer.Inner();
inner.y;
//// [b.js]
x.y;
var x, z = new Outer.Inner();
z.y;
