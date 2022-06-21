import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
// var AA: typeof A;
var AAA;
// AA = A; // okay
AAA = A; // error. 
AAA = "asdf";
