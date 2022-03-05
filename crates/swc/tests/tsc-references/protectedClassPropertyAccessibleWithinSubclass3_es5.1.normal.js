import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "method",
            value: function method() {
                this.x; // OK, accessed within their declaring class
            }
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
                this.x; // OK, accessed within a subclass of the declaring class
                swcHelpers.get(swcHelpers.getPrototypeOf(Derived.prototype), "x", this); // Error, x is not public
            }
        }
    ]);
    return Derived;
}(Base);
