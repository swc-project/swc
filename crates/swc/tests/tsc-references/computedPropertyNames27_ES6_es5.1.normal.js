import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var tmp = (super(), "prop");
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(C, Base);
    var _super = swcHelpers.createSuper(C);
    function C() {
        swcHelpers.classCallCheck(this, C);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(C, [
        {
            key: tmp,
            value: function value() {}
        }
    ]);
    return C;
}(Base);
