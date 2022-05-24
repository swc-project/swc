var _ref, _super_a, _tmp;
import _extends from "@swc/helpers/lib/_extends.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _set from "@swc/helpers/lib/_set.js";
class C extends B {
    constructor(...args){
        super(...args), this.x = 1, this.y = this.x, this.z = super.f();
    }
}
C.x = void 0, C.y1 = C.x, C.y2 = C.x(), C.y3 = null == C ? void 0 : C.x(), C.y4 = C.x(), C.y5 = null == C ? void 0 : C.x(), C.z1 = _get(_get_prototype_of(C), "a", C), C.z2 = _get(_get_prototype_of(C), "a", C), C.z3 = _get(_get_prototype_of(C), "f", C).call(C), C.z4 = _get(_get_prototype_of(C), "f", C).call(C), C.z5 = _set(_get_prototype_of(C.prototype), "a", 0, C, !0), C.z6 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) + 1, C, !0), C.z7 = void _set(_get_prototype_of(C.prototype), "a", 0, C, !0), C.z8 = [_get(_get_prototype_of(C), "a", C)] = [
    0
], C.z9 = [_get(_get_prototype_of(C), "a", C) = 0] = [
    0
], C.z10 = [..._get(_get_prototype_of(C), "a", C)] = [
    0
], C.z11 = { x: _get(_get_prototype_of(C), "a", C)  } = {
    x: 0
}, C.z12 = { x: _get(_get_prototype_of(C), "a", C) = 0  } = {
    x: 0
}, C.z13 = (_tmp = {
    x: 0
}, _get(_get_prototype_of(C), "a", C) = _extends({}, _tmp), _tmp), C.z14 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) + 1, C, !0), C.z15 = _set(_get_prototype_of(C.prototype), "a", _get(_get_prototype_of(C), "a", C) - 1, C, !0), C.z16 = _set(_get_prototype_of(C.prototype), _ref = "a", _get(_get_prototype_of(C), _ref, C) + 1, C, !0), C.z17 = (_set(_get_prototype_of(C.prototype), "a", (_super_a = +_get(_get_prototype_of(C), "a", C)) + 1, C, !0), _super_a), C.z18 = _get(_get_prototype_of(C), "a", C)``;
