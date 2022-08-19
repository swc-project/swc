import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
new (function() {
    "use strict";
    function X() {
        _class_call_check(this, X);
    }
    var _proto = X.prototype;
    return _proto.m = function() {
        var Y;
        return Y = function Y() {
            _class_call_check(this, Y);
        }, new Y();
    }, X;
}())().m();
