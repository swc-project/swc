import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    return C.prototype.fn = function() {
        return this;
    }, C;
}(), r = new C().fn();
r[1], r.a;
