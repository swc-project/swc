import * as swcHelpers from "@swc/helpers";
var B = function() {
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return C.prototype.body = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this) && swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this).call(this);
    }, C;
}(B);
