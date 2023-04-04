//// [localTypes5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
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
    var x = new X();
    return x.m();
}
var x = foo();
