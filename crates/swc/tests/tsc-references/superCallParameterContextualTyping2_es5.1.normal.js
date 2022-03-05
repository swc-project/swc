import * as swcHelpers from "@swc/helpers";
var A = function A(map) {
    "use strict";
    swcHelpers.classCallCheck(this, A);
    this.map = map;
};
var C = /*#__PURE__*/ function(A) {
    "use strict";
    swcHelpers.inherits(C, A);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.call(this, function(value) {
            return String(value());
        });
    }
    return C;
}(A);
