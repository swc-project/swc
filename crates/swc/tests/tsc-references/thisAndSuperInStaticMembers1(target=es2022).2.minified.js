//// [thisAndSuperInStaticMembers1.ts]
class C extends B {
    static x = void 0;
    static y1 = this.x;
    static y2 = this.x();
    static y3 = this?.x();
    static y4 = this.x();
    static y5 = this?.x();
    static z1 = super.a;
    static z2 = super.a;
    static z3 = super.f();
    static z4 = super.f();
    static z5 = super.a = 0;
    static z6 = super.a += 1;
    static z7 = void (super.a = 0);
    static z8 = [super.a] = [
        0
    ];
    static z9 = [super.a = 0] = [
        0
    ];
    static z10 = [...super.a] = [
        0
    ];
    static z11 = { x: super.a } = {
        x: 0
    };
    static z12 = { x: super.a = 0 } = {
        x: 0
    };
    static z13 = { ...super.a } = {
        x: 0
    };
    static z14 = ++super.a;
    static z15 = --super.a;
    static z16 = ++super.a;
    static z17 = super.a++;
    static z18 = super.a``;
    x = 1;
    y = this.x;
    z = super.f();
}
