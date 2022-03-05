import * as swcHelpers from "@swc/helpers";
var B = function() {
    "use strict";
    swcHelpers.classCallCheck(this, B);
}, C = function(B1) {
    "use strict";
    swcHelpers.inherits(C, B1);
    var _super = swcHelpers.createSuper(C);
    function C() {
        return swcHelpers.classCallCheck(this, C), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(C, [
        {
            key: "body",
            value: function() {
                swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this) && swcHelpers.get(swcHelpers.getPrototypeOf(C.prototype), "m", this).call(this);
            }
        }
    ]), C;
}(B);
