import * as swcHelpers from "@swc/helpers";
var B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B), this.p1 = 1, this.p2 = 1;
    }
    var _proto = B.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, B;
}(), D = function(B) {
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        var _this;
        return swcHelpers.classCallCheck(this, D), _this = _super.apply(this, arguments), _this.p1 = 2, _this.p2 = 3, _this;
    }
    var _proto = D.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, D;
}(B), DD = function(B) {
    swcHelpers.inherits(DD, B);
    var _super = swcHelpers.createSuper(DD);
    function DD() {
        return swcHelpers.classCallCheck(this, DD), _super.apply(this, arguments);
    }
    return DD;
}(B);
