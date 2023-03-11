//// [classStaticBlock3.ts]
class C {
    static{
        this.f1 = 1;
    }
    static{
        console.log(C.f1, C.f2, C.f3);
    }
    static{
        this.f2 = 2;
    }
    static{
        console.log(C.f1, C.f2, C.f3);
    }
    static{
        this.f3 = 3;
    }
}
