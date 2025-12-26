//// [thisAndSuperInStaticMembers1.ts]
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _extends } from "@swc/helpers/_/_extends";
var _ref;
var _this, _this1;
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
_define_property(C, "y3", (_this = C) === null || _this === void 0 ? void 0 : _this.x());
_define_property(C, "y4", C["x"]());
_define_property(C, "y5", (_this1 = C) === null || _this1 === void 0 ? void 0 : _this1["x"]());
_define_property(C, "z1", super.a);
_define_property(C, "z2", super["a"]);
_define_property(C, "z3", super.f());
_define_property(C, "z4", super["f"]());
_define_property(C, "z5", super.a = 0);
_define_property(C, "z6", super.a += 1);
_define_property(C, "z7", (()=>{
    super.a = 0;
})());
_define_property(C, "z8", [super.a] = [
    0
]);
_define_property(C, "z9", [super.a = 0] = [
    0
]);
_define_property(C, "z10", [...super.a] = [
    0
]);
_define_property(C, "z11", { x: super.a } = {
    x: 0
});
_define_property(C, "z12", { x: super.a = 0 } = {
    x: 0
});
_define_property(C, "z13", (_ref = {
    x: 0
}, {} = _ref, super.a = _extends({}, _ref), _ref));
_define_property(C, "z14", ++super.a);
_define_property(C, "z15", --super.a);
_define_property(C, "z16", ++super["a"]);
_define_property(C, "z17", super.a++);
_define_property(C, "z18", super.a``);
