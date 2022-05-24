import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var A = function() {
    "use strict";
    _class_call_check(this, A);
};
A.bar = A.foo + 1, A.foo, A.foo = 1;
