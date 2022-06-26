import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.x = function(a) {};
    }
    return C.prototype.foo = function() {}, C;
}(), c = new C();
c.data = c.x(null), c.data = c.foo();
