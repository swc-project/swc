//// [computedPropertyNames13_ES5.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
var s;
var n;
var a;
var C = /*#__PURE__*/ function(_prop, _prop1, _prop2, _prop3) {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[s] = function() {};
    _proto[n] = function() {};
    _proto[_prop1] = function() {};
    _proto[_prop2] = function() {};
    _proto[0] = function() {};
    _proto[a] = function() {};
    _proto["hello bye"] = function() {};
    C[_prop] = function() {};
    C[""] = function() {};
    C[true] = function() {};
    C[_prop3] = function() {};
    return C;
}(s + s, s + n, +s, "hello ".concat(a, " bye"));
