import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function() {
    swcHelpers.classCallCheck(this, Derived);
}, Derived2 = function(Base1) {
    swcHelpers.inherits(Derived2, Base1);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
