import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    return X.prototype.m = function() {
        return new function Y() {
            _class_call_check(this, Y);
        }();
    }, X;
}())().m();
