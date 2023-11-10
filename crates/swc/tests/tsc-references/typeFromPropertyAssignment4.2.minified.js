//// [typeFromPropertyAssignment4.ts]
//// [def.js]
//// [a.js]
var local;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
Outer.Inner = function _class() {
    _class_call_check(this, _class), this.y = 12;
}, local.y, new Outer.Inner().y;
//// [b.js]
(void 0).y, new Outer.Inner().y;
