//// [callGenericFunctionWithIncorrectNumberOfTypeArguments.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function f(x, y) {
    return null;
}
var f3, i, i2, r1 = f(1, ""), r1b = f(1, ""), f2 = function(x, y) {
    return null;
}, r2 = f2(1, ""), r2b = f2(1, ""), r3 = f3(1, ""), r3b = f3(1, ""), C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.f = function(x, y) {
        return null;
    }, C;
}(), r4 = new C().f(1, ""), r4b = new C().f(1, ""), r5 = i.f(1, ""), r5b = i.f(1, ""), C2 = function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    return C2.prototype.f = function(x, y) {
        return null;
    }, C2;
}(), r6 = new C2().f(1, ""), r6b = new C2().f(1, ""), r7 = i2.f(1, ""), r7b = i2.f(1, "");
