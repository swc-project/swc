import * as swcHelpers from "@swc/helpers";
function foo() {
    var X = /*#__PURE__*/ function() {
        "use strict";
        function X() {
            swcHelpers.classCallCheck(this, X);
        }
        var _proto = X.prototype;
        _proto.m = function m() {
            return function() {
                var Y = function Y() {
                    swcHelpers.classCallCheck(this, Y);
                };
                return new Y();
            }();
        };
        return X;
    }();
    var x1 = new X();
    return x1.m();
}
var x = foo();
