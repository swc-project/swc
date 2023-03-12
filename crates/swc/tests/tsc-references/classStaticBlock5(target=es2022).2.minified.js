//// [classStaticBlock5.ts]
class B {
    static{
        this.a = 1;
    }
    static{
        this.b = 2;
    }
}
class C extends B {
    static{
        this.b = 3;
    }
    static{
        this.c = super.a;
    }
    static{
        this.b, super.b, super.a;
    }
}
