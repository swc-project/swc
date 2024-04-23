//// [stringNamedPropertyAccess.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c;
var r1 = c["a b"];
var r1b = C['c d'];
var i;
var r2 = i["a b"];
var a;
var r3 = a["a b"];
var b = {
    "a b": 1
};
var r4 = b["a b"];
