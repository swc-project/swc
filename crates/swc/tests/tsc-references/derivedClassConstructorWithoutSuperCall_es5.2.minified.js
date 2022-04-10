import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    function Derived() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived), swcHelpers.possibleConstructorReturn(_this);
    }
    return swcHelpers.inherits(Derived, Base1), swcHelpers.createSuper(Derived), Derived;
}(Base), Base2 = function() {
    swcHelpers.classCallCheck(this, Base2);
}, Derived2 = function(Base21) {
    function Derived2() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived2), swcHelpers.possibleConstructorReturn(_this);
    }
    return swcHelpers.inherits(Derived2, Base21), swcHelpers.createSuper(Derived2), Derived2;
}(Base2), Derived3 = function(Base22) {
    function Derived3() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived3), swcHelpers.possibleConstructorReturn(_this);
    }
    return swcHelpers.inherits(Derived3, Base22), swcHelpers.createSuper(Derived3), Derived3;
}(Base2), Derived4 = function(Base23) {
    swcHelpers.inherits(Derived4, Base23);
    var _super = swcHelpers.createSuper(Derived4);
    function Derived4() {
        var _this;
        return swcHelpers.classCallCheck(this, Derived4), _this = _super.call(this), swcHelpers.possibleConstructorReturn(_this);
    }
    return Derived4;
}(Base2);
