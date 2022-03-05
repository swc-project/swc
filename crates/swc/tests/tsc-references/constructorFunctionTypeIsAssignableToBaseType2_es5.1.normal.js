import * as swcHelpers from "@swc/helpers";
var Base = function Base(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(x) {
        swcHelpers.classCallCheck(this, Derived);
        return _super.call(this, x);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived2, Base);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2(x) {
        swcHelpers.classCallCheck(this, Derived2);
        var _this = _super.call(this, x);
        return swcHelpers.possibleConstructorReturn(_this, 1);
    }
    return Derived2;
}(Base);
