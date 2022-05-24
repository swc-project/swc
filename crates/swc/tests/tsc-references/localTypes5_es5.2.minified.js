import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
!function() {
    var X = function() {
        "use strict";
        function X() {
            _class_call_check(this, X);
        }
        return X.prototype.m = function() {
            var Y;
            return new (Y = function() {
                _class_call_check(this, Y);
            })();
        }, X;
    }();
    return new X().m();
}();
