import * as swcHelpers from "@swc/helpers";
var _ref, _super_a;
class C extends B {
    constructor(...args){
        super(...args);
        // these should be unaffected
        this.x = 1;
        this.y = this.x;
        this.z = super.f();
    }
}
C.x = undefined;
C.y1 = C.x;
C.y2 = C.x();
C.y3 = C === null || C === void 0 ? void 0 : C.x();
C.y4 = C["x"]();
C.y5 = C === null || C === void 0 ? void 0 : C["x"]();
C.z1 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
C.z2 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C);
C.z3 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
C.z4 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "f", C).call(C);
C.z5 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", 0, C, true);
C.z6 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) + 1, C, true);
C.z7 = (()=>{
    swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", 0, C, true);
})();
C.z8 = [swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)] = [
    0
];
C.z9 = [swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = 0] = [
    0
];
C.z10 = [...swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)] = [
    0
];
C.z11 = { x: swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)  } = {
    x: 0
};
C.z12 = { x: swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = 0  } = {
    x: 0
};
var _tmp;
C.z13 = (_tmp = {
    x: 0
}, swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) = swcHelpers.extends({}, _tmp), _tmp);
C.z14 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) + 1, C, true);
C.z15 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C) - 1, C, true);
C.z16 = swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), _ref = "a", swcHelpers.get(swcHelpers.getPrototypeOf(C), _ref, C) + 1, C, true);
C.z17 = (swcHelpers.set(swcHelpers.getPrototypeOf(C.prototype), "a", (_super_a = +swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)) + 1, C, true), _super_a);
C.z18 = swcHelpers.get(swcHelpers.getPrototypeOf(C), "a", C)``;
