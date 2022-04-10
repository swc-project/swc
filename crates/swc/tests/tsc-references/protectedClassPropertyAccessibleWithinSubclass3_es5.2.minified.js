import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.method = function() {
        this.x;
    }, Base;
}(), Derived = function(Base) {
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived.prototype.method1 = function() {
        this.x, swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "x", this);
    }, Derived;
}(Base);
