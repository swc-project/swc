import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Base2 = function() {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
}, Derived2 = function(Base21) {
    "use strict";
    swcHelpers.inherits(Derived2, Base21);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
