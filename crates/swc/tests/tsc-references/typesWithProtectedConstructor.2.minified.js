//// [typesWithProtectedConstructor.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function C() {
    "use strict";
    _class_call_check(this, C);
}, c = new C(), r = c.constructor, C2 = function C2(x) {
    "use strict";
    _class_call_check(this, C2);
}, c2 = new C2(), r2 = c2.constructor;
