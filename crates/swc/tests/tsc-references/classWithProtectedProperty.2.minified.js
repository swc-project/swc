//// [classWithProtectedProperty.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
(function() {
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
})().g = function() {
    return "";
};
