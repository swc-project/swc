import * as swcHelpers from "@swc/helpers";
!function() {
    var X = function() {
        "use strict";
        function X() {
            swcHelpers.classCallCheck(this, X);
        }
        return swcHelpers.createClass(X, [
            {
                key: "m",
                value: function() {
                    var Y;
                    return new (Y = function() {
                        swcHelpers.classCallCheck(this, Y);
                    })();
                }
            }
        ]), X;
    }();
    return new X().m();
}();
