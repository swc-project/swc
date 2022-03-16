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
        swcHelpers.classCallCheck(this, C);
        var _this;
        _this = _super.call(this);
        var obj = swcHelpers.defineProperty({}, (_this = _super.call(this), "prop"), function() {});
        return _this;
    }
    return C;
}(Base);
