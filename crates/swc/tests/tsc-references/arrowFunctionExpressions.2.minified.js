//// [arrowFunctionExpressions.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
!function() {
    "use strict";
    function MyClass() {
        var _this = this;
        _class_call_check(this, MyClass), this.m = function(n) {
            return n + 1;
        }, this.p = function(n) {
            return n && _this;
        };
    }
    return MyClass.prototype.fn = function() {}, MyClass;
}(), 0..toExponential();
