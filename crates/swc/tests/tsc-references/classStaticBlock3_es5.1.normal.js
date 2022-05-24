import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @target: esnext, es2022
var a = 1;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.f1 = 1;
var __ = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f2 = 2;
var __1 = {
    writable: true,
    value: function() {
        console.log(C.f1, C.f2, C.f3);
    }()
};
C.f3 = 3;
