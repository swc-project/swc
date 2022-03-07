import * as swcHelpers from "@swc/helpers";
!function() {
    var X = function() {
        "use strict";
        function X() {
            swcHelpers.classCallCheck(this, X);
        }
        return X.prototype.m = function() {
            var Y;
            return new (Y = function() {
                swcHelpers.classCallCheck(this, Y);
            })();
        }, X;
    }();
    return new X().m();
}();
