import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var A = function() {
    "use strict";
    _class_call_check(this, A);
};
A.bar = A.foo + 1, A.foo, A.foo = 1;
