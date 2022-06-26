import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var x;
var a = x;
var b = x;
var c = x;
var d = x;
var e = x;
e = x; // should work
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var f;
f = x;
var g;
g = x;
var h = x;
function i(a) {
    a = x;
}
