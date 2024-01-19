//// [a.js]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var si, oi, Outer = function() {
    function O() {
        _class_call_check(this, O);
    }
    var _proto = O.prototype;
    return _proto.m = function(x, y) {}, O;
}();
Outer.Inner = function() {
    function I() {
        _class_call_check(this, I);
    }
    var _proto = I.prototype;
    return _proto.n = function(a, b) {}, I;
}(), si.m, oi.n;
