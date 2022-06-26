import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
// @target: es5, esnext
// @useDefineForClassFields: true
var x = "p";
var _x = x;
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(y) {
        _class_call_check(this, A);
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[_x] = 14;
        this.z = this.y;
    }
    var _proto = A.prototype;
    _proto.m = function m() {};
    return A;
}();
var B = function B() {
    "use strict";
    _class_call_check(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C(ka) {
        _class_call_check(this, C);
        var _this;
        _this = _super.call(this);
        _this.ka = ka;
        _this.z = _this.ka;
        _this.ki = _this.ka;
        return _this;
    }
    return C;
}(B);
