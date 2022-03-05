import * as swcHelpers from "@swc/helpers";
var Base = /*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "x",
            get: function get() {
                return 1;
            },
            set: function set(v) {}
        }
    ]);
    return Base;
}();
var Derived = // error
/*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    swcHelpers.createClass(Derived, [
        {
            key: "x",
            value: function x() {
                return 1;
            }
        }
    ]);
    return Derived;
}(Base);
