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
    this.a = 1;
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived(a) {
        _class_call_check(this, Derived);
        var _this;
        _this = _super.call(this);
        _this.a = a;
        _this.b = _this.a /*undefined*/ ;
        return _this;
    }
    return Derived;
}(Base);
