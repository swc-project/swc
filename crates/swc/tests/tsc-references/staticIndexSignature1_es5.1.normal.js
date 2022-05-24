import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
};
C["foo"] = 1;
C.bar = 2;
var foo = C["foo"];
C[42] = 42;
C[2] = 2;
var bar = C[42];
