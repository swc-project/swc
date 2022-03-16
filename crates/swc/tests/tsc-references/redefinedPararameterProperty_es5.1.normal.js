import * as swcHelpers from "@swc/helpers";
// @noTypesAndSymbols: true
// @strictNullChecks: true
// @target: esnext
// @useDefineForClassFields: true
var Base = function Base() {
    "use strict";
    swcHelpers.classCallCheck(this, Base);
    this.a = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    swcHelpers.inherits(Derived, Base);
    var _super = swcHelpers.createSuper(Derived);
    function Derived(a) {
        swcHelpers.classCallCheck(this, Derived);
        var _this;
        _this = _super.call(this);
        _this.a = a;
        _this.b = _this.a /*undefined*/ ;
        return _this;
    }
    return Derived;
}(Base);
