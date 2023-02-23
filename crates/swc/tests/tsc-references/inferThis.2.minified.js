//// [/a.js]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
export var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.b = function() {
        return this;
    }, C.a = function() {
        return this;
    }, C;
}();
C.a(), new C().b();
