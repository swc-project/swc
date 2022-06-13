import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @strict: true
// @target: es6
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.method = function method() {};
    _proto.other = function other() {
        var _obj, ref;
        (ref = (_obj = this).method) === null || ref === void 0 ? void 0 : ref.call(_obj);
    };
    return C;
}();
