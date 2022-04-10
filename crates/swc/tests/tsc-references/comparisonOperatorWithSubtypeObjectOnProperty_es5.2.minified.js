import * as swcHelpers from "@swc/helpers";
var Base = function() {
    swcHelpers.classCallCheck(this, Base);
}, Derived = function(Base1) {
    swcHelpers.inherits(Derived, Base1);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived;
}(Base), A1 = function() {
    swcHelpers.classCallCheck(this, A1);
}, B1 = function() {
    swcHelpers.classCallCheck(this, B1);
}, A2 = function() {
    swcHelpers.classCallCheck(this, A2);
}, B2 = function(A21) {
    swcHelpers.inherits(B2, A21);
    var _super = swcHelpers.createSuper(B2);
    function B2() {
        return swcHelpers.classCallCheck(this, B2), _super.apply(this, arguments);
    }
    return B2;
}(A2);
