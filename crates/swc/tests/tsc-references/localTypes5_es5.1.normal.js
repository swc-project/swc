import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function foo() {
    var X = /*#__PURE__*/ function() {
        "use strict";
        function X() {
            _class_call_check(this, X);
        }
        var _proto = X.prototype;
        _proto.m = function m() {
            return function() {
                var Y = function Y() {
                    _class_call_check(this, Y);
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
