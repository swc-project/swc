import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target: es6
var s;
var n;
var a;
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto[s] = function() {};
    _proto[n] = function() {};
    _proto[s + n] = function() {};
    _proto[+s] = function() {};
    _proto[0] = function() {};
    _proto[a] = function() {};
    _proto["hello bye"] = function() {};
    C[s + s] = function() {};
    C[""] = function() {};
    C[true] = function() {};
    C["hello ".concat(a, " bye")] = function() {};
    return C;
}();
