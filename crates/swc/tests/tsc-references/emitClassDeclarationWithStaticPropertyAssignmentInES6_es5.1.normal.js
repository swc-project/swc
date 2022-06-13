import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target:es6
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C.z = "Foo";
var D = function D() {
    "use strict";
    _class_call_check(this, D);
    this.x = 20000;
};
D.b = true;
