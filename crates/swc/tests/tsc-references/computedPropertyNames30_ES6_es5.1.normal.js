import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _define_property from "@swc/helpers/lib/_define_property.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
// @target: es6
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var C = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(C, Base);
    var _super = _create_super(C);
    function C() {
        var _this = this;
        _class_call_check(this, C);
        var _this1;
        _this1 = _super.call(this);
        (function() {
            var obj = // Ideally, we would capture this. But the reference is
            // illegal, and not capturing this is consistent with
            //treatment of other similar violations.
            _define_property({}, (_this1 = _super.call(_this), "prop"), function() {});
        });
        return _this1;
    }
    return C;
}(Base);
