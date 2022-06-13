import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// basic uses of function literals with constructor overloads
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
};
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
};
var f = C;
var f2 = C;
var f3 = D;
