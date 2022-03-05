import * as swcHelpers from "@swc/helpers";
var Base = // @target: *,-es3
// @strict: true
// @noTypesAndSymbols: true
// GH#34952
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "method",
            value: function method() {}
        }
    ]);
    return Base;
}();
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derived, [
        {
            key: "method1",
            value: function method1() {
                var ref;
                return (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
            }
        },
        {
            key: "method2",
            value: function method2() {
                var ref;
                return (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
            }
        }
    ]);
    return Derived;
}(Base);
