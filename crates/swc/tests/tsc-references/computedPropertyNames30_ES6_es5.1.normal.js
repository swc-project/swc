import * as swcHelpers from "@swc/helpers";
// @target: es6
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        var _this = this;
        swcHelpers.classCallCheck(this, C);
        var _this1;
        _this1 = _super.call(this);
        (function() {
            var obj = // Ideally, we would capture this. But the reference is
            // illegal, and not capturing this is consistent with
            //treatment of other similar violations.
            swcHelpers.defineProperty({}, (_this1 = _super.call(_this), "prop"), function() {});
        });
        return _this1;
    }
    return C;
}(Base);
