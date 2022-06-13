import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Error for construct signature overloads to differ only by return type
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2(x, y) {
    "use strict";
    _class_call_check(this, C2);
};
var a;
var b;
