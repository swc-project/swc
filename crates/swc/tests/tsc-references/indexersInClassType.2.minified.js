//// [indexersInClassType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.fn = function() {
        return this;
    }, C;
}(), c = new C(), r = c.fn(), r2 = r[1], r3 = r.a;
