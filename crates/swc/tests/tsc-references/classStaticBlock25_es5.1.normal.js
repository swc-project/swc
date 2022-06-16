import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022
// @declaration: true
// @declarationMap: true
// @sourceMap: true
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
