import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C), this.x = function(a) {};
    }
    return C.prototype.foo = function() {}, C;
}(), c = new C();
c.data = c.x(null), c.data = c.foo();
