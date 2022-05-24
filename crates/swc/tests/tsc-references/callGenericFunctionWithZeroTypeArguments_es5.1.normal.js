import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// valid invocations of generic functions with no explicit type arguments provided 
function f(x) {
    return null;
}
var r = f(1);
var f2 = function(x) {
    return null;
};
var r2 = f2(1);
var f3;
var r3 = f3(1);
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.f = function f(x) {
        return null;
    };
    return C;
}();
var r4 = new C().f(1);
var i;
var r5 = i.f(1);
var C2 = /*#__PURE__*/ function() {
    "use strict";
    function C2() {
        _class_call_check(this, C2);
    }
    var _proto = C2.prototype;
    _proto.f = function f(x) {
        return null;
    };
    return C2;
}();
var r6 = new C2().f(1);
var i2;
var r7 = i2.f(1);
