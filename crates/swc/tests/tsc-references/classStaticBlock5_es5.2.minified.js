import * as swcHelpers from "@swc/helpers";
var B = function() {
    swcHelpers.classCallCheck(this, B);
};
B.a = 1, B.b = 2;
var C = function(B1) {
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C;
}(B);
C.b = 3, C.c = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C), C.b, super.b, super.a;
