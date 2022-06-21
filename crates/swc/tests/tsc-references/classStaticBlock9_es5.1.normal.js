import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022, es2015, es5
var A = function A() {
    "use strict";
    _class_call_check(this, A);
};
A.bar = A.foo + 1;
var __ = {
    writable: true,
    value: function() {
        A.foo + 2;
    }()
};
A.foo = 1;
