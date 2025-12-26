//// [thisAndSuperInStaticMembers4.ts]
import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var __ = new WeakMap(), __2 = new WeakMap(), __3 = new WeakMap(), __4 = new WeakMap(), __5 = new WeakMap(), __6 = new WeakMap(), __7 = new WeakMap(), __8 = new WeakMap(), C = /*#__PURE__*/ function(B1) {
    function C() {
        var _this;
        return _class_call_check(this, C), _this = _call_super(this, C, arguments), _this.x = 1, _this.y = _this.x, _this.z = _get((_assert_this_initialized(_this), _get_prototype_of(C.prototype)), "f", _this).call(_this), _this;
    }
    return _inherits(C, B1), C;
}(B);
__.set(C, {
    writable: !0,
    value: C.x = void 0
}), __2.set(C, {
    writable: !0,
    value: C.y1 = C.x
}), __3.set(C, {
    writable: !0,
    value: C.y2 = C.x()
}), __4.set(C, {
    writable: !0,
    value: C.y3 = null == C ? void 0 : C.x()
}), __5.set(C, {
    writable: !0,
    value: C.y4 = C.x()
}), __6.set(C, {
    writable: !0,
    value: C.y5 = null == C ? void 0 : C.x()
}), __7.set(C, {
    writable: !0,
    value: C.z3 = super.f()
}), __8.set(C, {
    writable: !0,
    value: C.z4 = super.f()
});
