import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022, es2015, es5
var a = 1;
var b = 2;
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var __ = {
    writable: true,
    value: function() {
        var a1 = 11;
        a1;
        b;
    }()
};
var __1 = {
    writable: true,
    value: function() {
        var a2 = 11;
        a2;
        b;
    }()
};
