class A {
    static get foo() { return 42; }
}
class B extends A {
    static foo = 427;
}

console.log(A.foo, B.foo)