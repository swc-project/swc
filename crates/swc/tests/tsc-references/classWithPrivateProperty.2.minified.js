//// [classWithPrivateProperty.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.a = "", this.b = "", this.d = function() {
            return "";
        };
    }
    return C.prototype.c = function() {
        return "";
    }, C.f = function() {
        return "";
    }, C;
}();
C.g = function() {
    return "";
};
var c = new C(), r1 = c.x, r2 = c.a, r3 = c.b, r4 = c.c(), r5 = c.d(), r6 = C.e, r7 = C.f(), r8 = C.g();
