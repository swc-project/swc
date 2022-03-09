import * as swcHelpers from "@swc/helpers";
// @strictNullChecks: true
var B = function B() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
};
var C = /*#__PURE__*/ function(B) {
    "use strict";
    swcHelpers.inherits(C, B);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    var _proto = C.prototype;
    _proto.body = function body() {
        swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this) && swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this).call(this);
    };
    return C;
}(B);
