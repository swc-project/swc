//// [callNonGenericFunctionWithTypeArguments.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f(x) {
    return null;
}
var f3, i, i2, a, a2, r = f(1), f2 = function(x) {
    return null;
}, r2 = f2(1), r3 = f3(1), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x) {
        return null;
    }, C;
}(), r4 = new C().f(1), r5 = i.f(1), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x) {
        return null;
    }, C2;
}(), r6 = new C2().f(1), r7 = i2.f(1), r8 = a(), r8 = a2();
