//// [typeFromPropertyAssignment4.ts]
//// [def.js]
var Outer = {};
//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Outer.Inner = function _class() {
    "use strict";
    _class_call_check(this, _class);
    /** @type {number} */ this.y = 12;
};
/** @type {Outer.Inner} */ var local;
local.y;
var inner = new Outer.Inner();
inner.y;
//// [b.js]
/** @type {Outer.Inner} */ var x;
x.y;
var z = new Outer.Inner();
z.y;
