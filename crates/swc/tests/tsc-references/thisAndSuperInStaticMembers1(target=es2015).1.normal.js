//// [thisAndSuperInStaticMembers1.ts]
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _extends from "@swc/helpers/src/_extends.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _set from "@swc/helpers/src/_set.mjs";
import _update from "@swc/helpers/src/_update.mjs";
class C extends B {
    constructor(...args){
        super(...args);
        // these should be unaffected
        _define_property(this, "x", 1);
        _define_property(this, "y", this.x);
        _define_property(this, "z", super.f());
    }
}
_define_property(C, "x", undefined);
_define_property(C, "y1", C.x);
_define_property(C, "y2", C.x());
_define_property(C, "y3", C === null || C === void 0 ? void 0 : C.x());
_define_property(C, "y4", C["x"]());
_define_property(C, "y5", C === null || C === void 0 ? void 0 : C["x"]());
_define_property(C, "z1", _get(_get_prototype_of(C), "a", C));
_define_property(C, "z2", _get(_get_prototype_of(C), "a", C));
_define_property(C, "z3", _get(_get_prototype_of(C), "f", C).call(C));
_define_property(C, "z4", _get(_get_prototype_of(C), "f", C).call(C));
_define_property(C, "z5", _set(_get_prototype_of(C), "a", 0, C, true));
_define_property(C, "z6", _update(_get_prototype_of(C), "a", C, true)._ += 1);
_define_property(C, "z7", (()=>{
    _set(_get_prototype_of(C), "a", 0, C, true);
})());
_define_property(C, "z8", [_update(_get_prototype_of(C), "a", C, true)._] = [
    0
]);
_define_property(C, "z9", [_update(_get_prototype_of(C), "a", C, true)._ = 0] = [
    0
]);
_define_property(C, "z10", [..._update(_get_prototype_of(C), "a", C, true)._] = [
    0
]);
_define_property(C, "z11", { x: _update(_get_prototype_of(C), "a", C, true)._  } = {
    x: 0
});
_define_property(C, "z12", { x: _update(_get_prototype_of(C), "a", C, true)._ = 0  } = {
    x: 0
});
var _tmp;
_define_property(C, "z13", (_tmp = {
    x: 0
}, _update(_get_prototype_of(C), "a", C, true)._ = _extends({}, _tmp), _tmp));
_define_property(C, "z14", ++_update(_get_prototype_of(C), "a", C, true)._);
_define_property(C, "z15", --_update(_get_prototype_of(C), "a", C, true)._);
_define_property(C, "z16", ++_update(_get_prototype_of(C), "a", C, true)._);
_define_property(C, "z17", _update(_get_prototype_of(C), "a", C, true)._++);
_define_property(C, "z18", _get(_get_prototype_of(C), "a", C)``);
