import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    _class_call_check(this, C);
}, D = function() {
    "use strict";
    _class_call_check(this, D);
}, X = function() {
    "use strict";
    _class_call_check(this, X);
};
function foo(t, t2) {}
var c1 = new X(), d1 = new X();
function foo2(t, t2) {}
foo(c1, d1), foo(c1, c1), foo2(c1, d1), foo2(c1, c1);
