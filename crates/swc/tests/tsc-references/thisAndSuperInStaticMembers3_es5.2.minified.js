import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var C = function(B) {
    "use strict";
    _inherits(C, B);
    var _super = _create_super(C);
    function C() {
        var _this;
        return _class_call_check(this, C), _this = _super.apply(this, arguments), _this.x = 1, _this.y = _this.x, _this.z = _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "f", _this).call(_this), _this;
    }
    return C;
}(B);
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z3 = _get(_get_prototype_of(C), "f", C).call(C), C.z4 = _get(_get_prototype_of(C), "f", C).call(C);
