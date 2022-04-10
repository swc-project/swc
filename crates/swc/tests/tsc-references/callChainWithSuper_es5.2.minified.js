import * as swcHelpers from "@swc/helpers";
var Base = function() {
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.method = function() {}, Base;
}(), Derived = function(Base) {
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    return _proto.method1 = function() {
        var ref;
        return null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
    }, _proto.method2 = function() {
        var ref;
        return null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
    }, Derived;
}(Base);
