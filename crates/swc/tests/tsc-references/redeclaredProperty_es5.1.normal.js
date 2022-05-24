import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @noTypesAndSymbols: true
// @strictNullChecks: true
// @target: esnext
// @useDefineForClassFields: true
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
    this.b = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this);
        _this.d = _this.b;
        _this.b = 2;
        return _this;
    }
    return Derived;
}(Base);
