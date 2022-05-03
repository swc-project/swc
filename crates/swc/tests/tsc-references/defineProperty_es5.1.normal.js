import * as swcHelpers from "@swc/helpers";
// @target: es5, esnext
// @useDefineForClassFields: true
var x = "p";
var A = /*#__PURE__*/ function() {
    "use strict";
    function A(y) {
        swcHelpers.classCallCheck(this, A);
        this.y = y;
        this.a = this.y;
        this["computed"] = 13;
        this[x] = 14;
        this.z = this.y;
    }
    var _proto = A.prototype;
    _proto.m = function m() {};
    return A;
}();
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C(ka) {
        swcHelpers.classCallCheck(this, C);
        var _this;
        _this = _super.call(this);
        _this.ka = ka;
        _this.z = _this.ka;
        _this.ki = _this.ka;
        return _this;
    }
    return C;
}(B);
