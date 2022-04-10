import * as swcHelpers from "@swc/helpers";
function rec1() {
    return rec2();
}
function rec2() {
    return rec1();
}
function rec3() {
    return rec4();
}
function rec4() {
    return rec3();
}
rec1(), rec2(), rec3(), rec4();
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base);
new Base(), new Base();
var Derived2 = function(Base2) {
    swcHelpers.inherits(Derived2, Base2);
    var _super = swcHelpers.createSuper(Derived2);
    function Derived2() {
        return swcHelpers.classCallCheck(this, Derived2), _super.apply(this, arguments);
    }
    return Derived2;
}(Base), AnotherClass = function() {
    swcHelpers.classCallCheck(this, AnotherClass);
};
