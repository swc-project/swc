import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// public is allowed on a constructor but is not meaningful
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = new C();
var r = c.constructor;
var C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2);
};
var c2 = new C2();
var r2 = c2.constructor;
