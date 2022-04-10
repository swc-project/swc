import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.staticMethod = function() {
        this.x;
    }, Base;
}(), Derived1 = function(Base) {
    swcHelpers.inherits(Derived1, Base);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1.staticMethod1 = function() {
        this.x, swcHelpers.get(swcHelpers.getPrototypeOf(Derived1), "x", this);
    }, Derived1;
}(Base), Derived2 = function(Derived1) {
    swcHelpers.inherits(Derived2, Derived1);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2.staticMethod3 = function() {
        this.x, swcHelpers.get(swcHelpers.getPrototypeOf(Derived2), "x", this);
    }, Derived2;
}(Derived1);
