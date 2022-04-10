import * as swcHelpers from "@swc/helpers";
var B = function() {
    function B() {
        swcHelpers.classCallCheck(this, B);
    }
    var _proto = B.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, B;
}(), D = function(B) {
    swcHelpers.inherits(D, B);
    var _super = swcHelpers.createSuper(D);
    function D() {
        return swcHelpers.classCallCheck(this, D), _super.apply(this, arguments);
    }
    var _proto = D.prototype;
    return _proto.foo = function(v) {}, _proto.fooo = function(v) {}, _proto.bar = function(v) {}, D;
}(B), C = function() {
    function C() {
        swcHelpers.classCallCheck(this, C);
    }
    var _proto = C.prototype;
    return _proto.foo = function() {}, _proto.fooo = function(v) {}, _proto.bar = function(v) {}, C;
}();
