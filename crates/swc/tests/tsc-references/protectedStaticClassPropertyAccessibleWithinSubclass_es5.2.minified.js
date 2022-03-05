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
                Base.x, Derived1.x, Derived2.x, Derived3.x;
            }
        }
    ]), Base;
}(), Derived1 = function(Base1) {
    "use strict";
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived1, null, [
        {
            key: "staticMethod1",
            value: function() {
                Base.x, Derived1.x, Derived2.x, Derived3.x;
            }
        }
    ]), Derived1;
}(Base), Derived2 = function(Base2) {
    "use strict";
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived2, null, [
        {
            key: "staticMethod2",
            value: function() {
                Base.x, Derived1.x, Derived2.x, Derived3.x;
            }
        }
    ]), Derived2;
}(Base), Derived3 = function(Derived11) {
    "use strict";
    swcHelpers.inherits(Derived3, Derived11);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        return swcHelpers.classCallCheck(this, Derived3), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived3, null, [
        {
            key: "staticMethod3",
            value: function() {
                Base.x, Derived1.x, Derived2.x, Derived3.x;
            }
        }
    ]), Derived3;
}(Derived1);
Base.x, Derived1.x, Derived2.x, Derived3.x;
