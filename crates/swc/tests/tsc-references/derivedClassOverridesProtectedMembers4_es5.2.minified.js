import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived1 = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base), Derived2 = function(Derived1) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived1);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived1);
