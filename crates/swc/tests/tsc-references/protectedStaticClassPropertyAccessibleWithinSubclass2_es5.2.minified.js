import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, null, [
        {
            key: "staticMethod",
            value: function() {
                this.x;
            }
        }
    ]), Base;
}(), Derived1 = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived1, null, [
        {
            key: "staticMethod1",
            value: function() {
                this.x, swcHelpers.get(swcHelpers.getPrototypeOf(Derived1), "x", this);
            }
        }
    ]), Derived1;
}(Base), Derived2 = function(Derived1) {
    "use strict";
    swcHelpers.inherits(Derived2, Derived1);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived2, null, [
        {
            key: "staticMethod3",
            value: function() {
                this.x, swcHelpers.get(swcHelpers.getPrototypeOf(Derived2), "x", this);
            }
        }
    ]), Derived2;
}(Derived1);
