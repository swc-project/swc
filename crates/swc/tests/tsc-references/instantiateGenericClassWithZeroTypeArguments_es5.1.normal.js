import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// no errors expected when instantiating a generic type with no type arguments provided
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
var c = new C();
var D = function D() {
    "use strict";
    _class_call_check(this, D);
};
var d = new D();
