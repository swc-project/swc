//// [classStaticBlock9.ts]
class A {
    static{
        this.bar = A.foo + 1;
    }
    static{
        A.foo + 2;
    }
    static{
        this.foo = 1;
    }
}
