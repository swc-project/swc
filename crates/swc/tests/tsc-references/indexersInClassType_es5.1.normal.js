import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.fn = function fn() {
        return this;
    };
    return C;
}();
var c = new C();
var r = c.fn();
var r2 = r[1];
var r3 = r.a;
