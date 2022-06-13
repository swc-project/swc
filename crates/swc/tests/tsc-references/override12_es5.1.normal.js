import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @noImplicitOverride: true
// @target: es2015,esnext
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check(this, A);
    }
    var _proto = A.prototype;
    _proto.m1 = function m1() {
        return 0;
    };
    _proto.m2 = function m2() {
        return 0;
    };
    _proto.m3 = function m3() {};
    return A;
}();
var B = /*#__PURE__*/ function(A) {
    "use strict";
    _inherits(B, A);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    _proto.m1 = function m1() {
        return 10;
    };
    _proto.m2 = function m2() {
        return 30;
    };
    _proto.m3 = function m3() {};
    return B;
}(A);
