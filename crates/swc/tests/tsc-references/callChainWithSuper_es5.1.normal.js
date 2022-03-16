import * as swcHelpers from "@swc/helpers";
// @target: *,-es3
// @strict: true
// @noTypesAndSymbols: true
// GH#34952
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.method = function method() {};
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
    var _proto = Derived.prototype;
    _proto.method1 = function method1() {
        var ref;
        return (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
    };
    _proto.method2 = function method2() {
        var ref;
        return (ref = swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "method", this)) === null || ref === void 0 ? void 0 : ref.call(this);
    };
    return Derived;
}(Base);
