import * as swcHelpers from "@swc/helpers";
var Base = // @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: a.js
/*#__PURE__*/ function() {
    "use strict";
    function Base() {
        swcHelpers.classCallCheck(this, Base);
    }
    swcHelpers.createClass(Base, [
        {
            key: "m",
            value: function m() {
                this.p = 1;
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
            key: "m",
            value: function m() {
                // should be OK, and p should have type number | undefined from its base
                this.p = 1;
            }
        }
    ]);
    return Derived;
}(Base);
