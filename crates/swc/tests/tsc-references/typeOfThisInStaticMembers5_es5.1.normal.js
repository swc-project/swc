import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: esnext, es2022, es6, es5
var C = function C(foo) {
    "use strict";
    _class_call_check(this, C);
    this.foo = foo;
};
C.create = function() {
    return new C("yep");
};
