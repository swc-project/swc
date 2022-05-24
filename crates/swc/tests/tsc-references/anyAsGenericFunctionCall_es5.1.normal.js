import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// any is considered an untyped function call
// can be called except with type arguments which is an error
var x;
var a = x();
var b = x("hello");
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = x(x);
var d = x(x);
