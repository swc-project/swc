import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// all of the below should be errors
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var C2 = function C2() {
    "use strict";
    _class_call_check(this, C2);
};
function f() {}
function f2() {}
var a;
var b = function() {};
var b2 = function() {};
