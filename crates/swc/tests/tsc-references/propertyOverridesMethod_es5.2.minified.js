import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    return A.prototype.m = function() {}, A;
}(), B = function(A) {
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        var _this;
        return swcHelpers.classCallCheck(this, B), _this = _super.apply(this, arguments), _this.m = function() {
            return 1;
        }, _this;
    }
    return B;
}(A);
