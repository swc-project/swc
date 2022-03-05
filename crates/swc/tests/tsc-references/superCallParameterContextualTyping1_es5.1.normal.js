import * as swcHelpers from "@swc/helpers";
var A = function A(map) {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.map = map;
};
var B = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(B, A);
    var _super = swcHelpers.createSuper(B);
    function B() {
        swcHelpers.classCallCheck(this, B);
        return _super.call(this, function(value) {
            return String(value.toExponential());
        });
    }
    return B;
}(A);
