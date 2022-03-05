import * as swcHelpers from "@swc/helpers";
var Base = function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    return swcHelpers.createClass(Base, [
        {
            key: "method",
            value: function() {}
        }
    ]), Base;
}(), Derived = function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        return swcHelpers.classCallCheck(this, Derived), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Derived, [
        {
            key: "method1",
            value: function() {
                var ref;
                return null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
            }
        },
        {
            key: "method2",
            value: function() {
                var ref;
                return null === (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) || void 0 === ref ? void 0 : ref.call(this);
            }
        }
    ]), Derived;
}(Base);
