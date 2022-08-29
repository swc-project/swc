//// [constructSignaturesWithOverloads2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var i2, C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
(C || (C = {})).x = 1, new C(1, "");
var C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2);
};
(C2 || (C2 = {})).x = 1, new C2(1, ""), new i2(1, ""), new i2(1, 1);
