import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// BUG 745747
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    C.f = function f(x) {};
    return C;
}();
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    C2.f = function f(x) {};
    return C2;
}();
var C3 = /*#__PURE__*/ function() {
    "use strict";
    function C3() {
        _class_call_check(this, C3);
    }
    C3.f = function f(x) {};
    return C3;
}();
