//// [constraintSatisfactionWithEmptyObject.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo(x) {}
var i, i2, r = foo({}), a = {}, r = foo({}), C = function C(x) {
    "use strict";
    _class_call_check(this, C), this.x = x;
}, r2 = new C({});
function foo2(x) {}
var r = foo2({}), a = {}, r = foo2({}), C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2), this.x = x;
}, r2 = new C2({});
