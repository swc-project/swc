//// [classStaticBlock9.ts]
class A {
    static bar = A.foo + 1;
    static{
        A.foo;
    }
    static foo = 1;
}
