import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A(y) {
        swcHelpers.classCallCheck(this, A), this.y = y, this.a = this.y, this.computed = 13, this.p = 14, this.z = this.y;
    }
    return A.prototype.m = function() {}, A;
}(), B = function() {
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C(ka) {
        var _this;
        return swcHelpers.classCallCheck(this, C), (_this = _super.call(this)).ka = ka, _this.z = _this.ka, _this.ki = _this.ka, _this;
    }
    return C;
}(B);
