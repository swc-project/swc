import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    var _proto = Base.prototype;
    _proto.method = function method() {
        this.x; // OK, accessed within their declaring class
    };
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
        this.x; // OK, accessed within a subclass of the declaring class
        swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "x", this); // Error, x is not public
    };
    return Derived;
}(Base);
