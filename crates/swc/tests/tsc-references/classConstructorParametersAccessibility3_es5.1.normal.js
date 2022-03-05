import * as swcHelpers from "@swc/helpers";
var Base = function Base(p) {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.p = p;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(p) {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this, p);
        _this.p = p;
        _this.p; // OK
        return _this;
    }
    return Derived;
}(Base);
var d;
d.p; // public, OK
