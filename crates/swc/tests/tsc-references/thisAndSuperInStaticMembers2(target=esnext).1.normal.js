//// [thisAndSuperInStaticMembers2.ts]
class C extends B {
    static{
        this.x = undefined;
    }
    static{
        this.y1 = this.x;
    }
    static{
        this.y2 = this.x();
    }
    static{
        this.y3 = this?.x();
    }
    static{
        this.y4 = this["x"]();
    }
    static{
        this.y5 = this?.["x"]();
    }
    static{
        this.z1 = super.a;
    }
    static{
        this.z2 = super["a"];
    }
    static{
        this.z3 = super.f();
    }
    static{
        this.z4 = super["f"]();
    }
    static{
        this.z5 = super.a = 0;
    }
    static{
        this.z6 = super.a += 1;
    }
    static{
        this.z7 = (()=>{
            super.a = 0;
        })();
    }
    static{
        this.z8 = [super.a] = [
            0
        ];
    }
    static{
        this.z9 = [super.a = 0] = [
            0
        ];
    }
    static{
        this.z10 = [...super.a] = [
            0
        ];
    }
    static{
        this.z11 = { x: super.a } = {
            x: 0
        };
    }
    static{
        this.z12 = { x: super.a = 0 } = {
            x: 0
        };
    }
    static{
        this.z13 = { ...super.a } = {
            x: 0
        };
    }
    static{
        this.z14 = ++super.a;
    }
    static{
        this.z15 = --super.a;
    }
    static{
        this.z16 = ++super["a"];
    }
    static{
        this.z17 = super.a++;
    }
    static{
        this.z18 = super.a``;
    }
    constructor(...args){
        super(...args), // these should be unaffected
        this.x = 1, this.y = this.x, this.z = super.f();
    }
}
