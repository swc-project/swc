var ref, ref1;
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
C.y1 = this.x;
C.y2 = this.x();
C.y3 = (ref = this) === null || ref === void 0 ? void 0 : ref.x();
C.y4 = this["x"]();
C.y5 = (ref1 = this) === null || ref1 === void 0 ? void 0 : ref1["x"]();
C.z3 = super.f();
C.z4 = super["f"]();
