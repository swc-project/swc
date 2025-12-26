//// [thisAndSuperInStaticMembers1.ts]
var _ref;
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _extends } from "@swc/helpers/_/_extends";
class C extends B {
    constructor(...args){
        super(...args), _define_property(this, "x", 1), _define_property(this, "y", this.x), _define_property(this, "z", super.f());
    }
}
_define_property(C, "x", void 0), _define_property(C, "y1", C.x), _define_property(C, "y2", C.x()), _define_property(C, "y3", null == C ? void 0 : C.x()), _define_property(C, "y4", C.x()), _define_property(C, "y5", null == C ? void 0 : C.x()), _define_property(C, "z1", super.a), _define_property(C, "z2", super.a), _define_property(C, "z3", super.f()), _define_property(C, "z4", super.f()), _define_property(C, "z5", super.a = 0), _define_property(C, "z6", super.a += 1), _define_property(C, "z7", void (super.a = 0)), _define_property(C, "z8", [super.a] = [
    0
]), _define_property(C, "z9", [super.a = 0] = [
    0
]), _define_property(C, "z10", [...super.a] = [
    0
]), _define_property(C, "z11", { x: super.a } = {
    x: 0
}), _define_property(C, "z12", { x: super.a = 0 } = {
    x: 0
}), _define_property(C, "z13", (_ref = {
    x: 0
}, super.a = _extends({}, _ref), _ref)), _define_property(C, "z14", ++super.a), _define_property(C, "z15", --super.a), _define_property(C, "z16", ++super.a), _define_property(C, "z17", super.a++), _define_property(C, "z18", super.a``);
