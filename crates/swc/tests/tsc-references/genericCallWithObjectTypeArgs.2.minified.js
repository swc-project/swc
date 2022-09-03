//// [genericCallWithObjectTypeArgs.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
}, D = function D() {
    "use strict";
    _class_call_check(this, D);
}, X = function X() {
    "use strict";
    _class_call_check(this, X);
};
function foo(t, t2) {}
var c1 = new X(), d1 = new X(), r = foo(c1, d1), r2 = foo(c1, c1);
