//// [functionLiteralForOverloads2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
}, D = function D(x) {
    "use strict";
    _class_call_check(this, D);
}, f = C, f2 = C, f3 = D;
