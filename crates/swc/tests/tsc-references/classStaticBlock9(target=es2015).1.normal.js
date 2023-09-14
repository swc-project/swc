//// [classStaticBlock9.ts]
class A {
}
A.bar = A.foo + 1;
A.foo + 2;
A.foo = 1;
