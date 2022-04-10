import * as swcHelpers from "@swc/helpers";
var A = function(x) {
    swcHelpers.classCallCheck(this, A), this.x = x, this.x = 0;
}, B = function(A1) {
    swcHelpers.inherits(B, A1);
    var _super = swcHelpers.createSuper(B);
    function B(x) {
        var _this;
        return swcHelpers.classCallCheck(this, B), (_this = _super.call(this, x)).x = 1, _this;
    }
    return B;
}(A), C = function(A2) {
    swcHelpers.inherits(C, A2);
    var _super = swcHelpers.createSuper(C);
    function C(x) {
        var _this;
        return swcHelpers.classCallCheck(this, C), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return C;
}(A), D = function(x) {
    swcHelpers.classCallCheck(this, D), this.x = x, this.x = 0;
}, E = function(D1) {
    swcHelpers.inherits(E, D1);
    var _super = swcHelpers.createSuper(E);
    function E(x) {
        var _this;
        return swcHelpers.classCallCheck(this, E), (_this = _super.call(this, x)).x = x, _this.x = 1, _this;
    }
    return E;
}(D);
