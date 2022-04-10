import * as swcHelpers from "@swc/helpers";
var x, b, b2, b3, b4, b5, b11, b16, Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), Derived2 = function(Derived) {
    swcHelpers.inherits(Derived2, Derived);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Derived), OtherDerived = function(Base2) {
    swcHelpers.inherits(OtherDerived, Base2);
    var _super = swcHelpers.createSuper(OtherDerived);
    function OtherDerived() {
        return swcHelpers.classCallCheck(this, OtherDerived), _super.apply(this, arguments);
    }
    return OtherDerived;
}(Base);
x.a = b, b = x.a, x.a2 = b2, b2 = x.a2, x.a3 = b3, b3 = x.a3, x.a4 = b4, b4 = x.a4, x.a5 = b5, b5 = x.a5, x.a11 = b11, b11 = x.a11, x.a16 = b16, b16 = x.a16;
