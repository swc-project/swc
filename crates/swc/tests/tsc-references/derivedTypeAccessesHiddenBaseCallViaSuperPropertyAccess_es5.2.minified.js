import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return Base.prototype.foo = function(x) {
        return null;
    }, Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    return _proto.foo = function(x) {
        return null;
    }, _proto.bar = function() {
        swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "foo", this).call(this, {
            a: 1
        }), swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "foo", this).call(this, {
            a: 1,
            b: 2
        }), this.foo({
            a: 1,
            b: 2
        });
    }, Derived;
}(Base);
