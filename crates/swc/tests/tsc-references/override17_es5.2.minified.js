import * as swcHelpers from "@swc/helpers";
var A = function() {
    function A() {
        swcHelpers.classCallCheck(this, A);
    }
    var _proto = A.prototype;
    return _proto.m1 = function() {
        return 0;
    }, _proto.m2 = function() {
        return 0;
    }, _proto.m3 = function() {}, A;
}(), B = function(A) {
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        return swcHelpers.classCallCheck(this, B), _super.apply(this, arguments);
    }
    var _proto = B.prototype;
    return _proto.m1 = function() {
        return 10;
    }, _proto.m2 = function() {
        return 30;
    }, _proto.m3 = function() {}, B;
}(A);
