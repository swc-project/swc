import * as swcHelpers from "@swc/helpers";
var Base = function(x) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(x) {
        return swcHelpers.classCallCheck(this, Derived), _super.call(this, x);
    }
    return Derived;
}(Base), Derived2 = function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2(x) {
        swcHelpers.classCallCheck(this, Derived2);
        var _this = _super.call(this, x);
        return swcHelpers.possibleConstructorReturn(_this, 1);
    }
    return Derived2;
}(Base);
