import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "x",
            get: function() {
                return 1;
            },
            set: function(v) {}
        }
    ]), Base;
}(), Derived = function(Base) {
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return Derived.prototype.x = function() {
        return 1;
    }, Derived;
}(Base);
