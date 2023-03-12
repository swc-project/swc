//// [classStaticBlock4.ts]
class C {
    static{
        this.s1 = 1;
    }
    static{
        this.s1, C.s1, this.s2, C.s2;
    }
    static{
        this.s2 = 2;
    }
    static{
        this.ss2 = this.s1;
    }
}
