import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Multiple indexers of the same type are an error
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var a;
var b = {
    y: ""
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
