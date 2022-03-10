import * as swcHelpers from "@swc/helpers";
// @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: a.js
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.p = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived() {
        swcHelpers.classCallCheck(this, Derived);
        return _super.apply(this, arguments);
    }
    var _proto = Derived.prototype;
    _proto.m = function m() {
        this.p = 1;
    };
    return Derived;
}(Base);
