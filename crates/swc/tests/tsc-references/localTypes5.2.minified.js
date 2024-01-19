//// [localTypes5.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
new (function() {
    function X() {
        _class_call_check(this, X);
    }
    var _proto = X.prototype;
    return _proto.m = function() {
        return new function Y() {
            _class_call_check(this, Y);
        }();
    }, X;
}())().m();
