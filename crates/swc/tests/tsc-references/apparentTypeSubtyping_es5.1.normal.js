import * as swcHelpers from "@swc/helpers";
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
};
var Derived = // is String (S) a subtype of U extends String (T)? Would only be true if we used the apparent type of U (T)
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Base2 = function Base2() {
    "use strict";
    swcHelpers.classCallCheck(this, Base2);
};
var Derived2 = // is U extends String (S) a subtype of String (T)? Apparent type of U is String so it succeeds
/*#__PURE__*/ function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Base2);
