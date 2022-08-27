//// [thisAndSuperInStaticMembers1.ts]
var _tmp;
import _extends from "@swc/helpers/src/_extends.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _update from "@swc/helpers/src/_update.mjs";
class C extends B {
    constructor(...args){
        super(...args), this.x = 1, this.y = this.x, this.z = super.f();
    }
}
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z1 = _get(_get_prototype_of(C), "a", C), C.z2 = _get(_get_prototype_of(C), "a", C), C.z3 = _get(_get_prototype_of(C), "f", C).call(C), C.z4 = _get(_get_prototype_of(C), "f", C).call(C), C.z5 = _set(_get_prototype_of(C), "a", 0, C, !0), C.z6 = _update(_get_prototype_of(C), "a", C, !0)._ += 1, C.z7 = void _set(_get_prototype_of(C), "a", 0, C, !0), C.z8 = [_update(_get_prototype_of(C), "a", C, !0)._] = [
    0
], C.z9 = [_update(_get_prototype_of(C), "a", C, !0)._ = 0] = [
    0
], C.z10 = [..._update(_get_prototype_of(C), "a", C, !0)._] = [
    0
], C.z11 = { x: _update(_get_prototype_of(C), "a", C, !0)._  } = {
    x: 0
}, C.z12 = { x: _update(_get_prototype_of(C), "a", C, !0)._ = 0  } = {
    x: 0
}, C.z13 = (_tmp = {
    x: 0
}, _update(_get_prototype_of(C), "a", C, !0)._ = _extends({}, _tmp), _tmp), C.z14 = ++_update(_get_prototype_of(C), "a", C, !0)._, C.z15 = --_update(_get_prototype_of(C), "a", C, !0)._, C.z16 = ++_update(_get_prototype_of(C), "a", C, !0)._, C.z17 = _update(_get_prototype_of(C), "a", C, !0)._++, C.z18 = _get(_get_prototype_of(C), "a", C)``;
