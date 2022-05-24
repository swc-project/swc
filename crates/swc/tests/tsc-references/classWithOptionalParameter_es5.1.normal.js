import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// classes do not permit optional parameters, these are errors
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f() {};
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.f = function f(x) {};
    return C2;
}();
