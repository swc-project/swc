import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    Base.staticMethod = function staticMethod() {
        this.x; // OK, accessed within their declaring class
    };
    return Base;
}();
var Derived1 = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        swcHelpers.classCallCheck(this, Derived1);
        return _super.apply(this, arguments);
    }
    Derived1.staticMethod1 = function staticMethod1() {
        this.x; // OK, accessed within a class derived from their declaring class
        swcHelpers.get(swcHelpers.getPrototypeOf(Derived1), "x", this); // Error, x is not public
    };
    return Derived1;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived1) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived1);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        swcHelpers.classCallCheck(this, Derived2);
        return _super.apply(this, arguments);
    }
    Derived2.staticMethod3 = function staticMethod3() {
        this.x; // OK, accessed within a class derived from their declaring class
        swcHelpers.get(swcHelpers.getPrototypeOf(Derived2), "x", this); // Error, x is not public
    };
    return Derived2;
}(Derived1);
