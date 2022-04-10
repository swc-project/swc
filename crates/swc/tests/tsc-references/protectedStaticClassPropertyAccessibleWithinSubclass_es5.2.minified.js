import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.staticMethod = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Base;
}(), Derived1 = function(Base1) {
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.staticMethod1 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived1;
}(Base), Derived2 = function(Base2) {
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.staticMethod2 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived2;
}(Base), Derived3 = function(Derived11) {
    swcHelpers.inherits(Derived3, Derived11);
    var _super = swcHelpers.createSuper(Derived3);
    function Derived3() {
        return swcHelpers.classCallCheck(this, Derived3), _super.apply(this, arguments);
    }
    return Derived3.staticMethod3 = function() {
        Base.x, Derived1.x, Derived2.x, Derived3.x;
    }, Derived3;
}(Derived1);
Base.x, Derived1.x, Derived2.x, Derived3.x;
