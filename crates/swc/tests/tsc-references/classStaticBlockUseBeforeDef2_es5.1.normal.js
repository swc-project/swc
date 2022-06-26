import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022
// @noEmit: true
// @strict: true
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var __ = {
    writable: true,
    value: function() {
        C.x = 1;
    }()
};
