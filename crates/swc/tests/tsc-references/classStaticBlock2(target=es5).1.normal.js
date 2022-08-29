//// [classStaticBlock2.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a = 1;
var b = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var __ = {
    writable: true,
    value: function() {
        var a = 11;
        a;
        b;
    }()
};
var __1 = {
    writable: true,
    value: function() {
        var a = 11;
        a;
        b;
    }()
};
