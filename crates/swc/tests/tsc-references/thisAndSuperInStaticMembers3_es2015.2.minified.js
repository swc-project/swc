var ref, ref1;
class C extends B {
    constructor(...args){
        super(...args), this.x = 1, this.y = this.x, this.z = super.f();
    }
}
C.x = void 0, C.y1 = this.x, C.y2 = this.x(), C.y3 = null === (ref = this) || void 0 === ref ? void 0 : ref.x(), C.y4 = this.x(), C.y5 = null === (ref1 = this) || void 0 === ref1 ? void 0 : ref1.x(), C.z3 = super.f(), C.z4 = super.f();
