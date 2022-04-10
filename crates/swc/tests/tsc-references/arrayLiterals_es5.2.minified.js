import * as swcHelpers from "@swc/helpers";
var C = function() {
    swcHelpers.classCallCheck(this, C);
};
new C(), new C();
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived1 = function(Base1) {
    swcHelpers.inherits(Derived1, Base1);
    var _super = swcHelpers.createSuper(Derived1);
    function Derived1() {
        return swcHelpers.classCallCheck(this, Derived1), _super.apply(this, arguments);
    }
    return Derived1;
}(Base), Derived2 = function(Base2) {
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base);
new Derived1(), new Derived2(), new Derived1(), new Derived1();
