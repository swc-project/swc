//// [genericCallWithFunctionTypedArguments4.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var a, b, C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
};
function foo4(cb) {}
var r = foo4(a), r2 = foo4(b);
