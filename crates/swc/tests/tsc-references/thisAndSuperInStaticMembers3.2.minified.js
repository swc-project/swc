//// [thisAndSuperInStaticMembers3.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var C = function(B1) {
    "use strict";
    _inherits(C, B1);
    var _super = _create_super(C);
    function C() {
        var _this;
        return _class_call_check(this, C), _this = _super.apply(this, arguments), _define_property(_assert_this_initialized(_this), "x", 1), _define_property(_assert_this_initialized(_this), "y", _this.x), _define_property(_assert_this_initialized(_this), "z", _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "f", _this).call(_this)), _this;
    }
    return C;
}(B);
_define_property(C, "x", void 0), _define_property(C, "y1", C.x), _define_property(C, "y2", C.x()), _define_property(C, "y3", null == C ? void 0 : C.x()), _define_property(C, "y4", C.x()), _define_property(C, "y5", null == C ? void 0 : C.x()), _define_property(C, "z3", _get(_get_prototype_of(C), "f", C).call(C)), _define_property(C, "z4", _get(_get_prototype_of(C), "f", C).call(C));
