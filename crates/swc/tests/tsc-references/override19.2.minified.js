//// [override19.ts]
class Context {
}
class A {
    doSomething() {}
}
CreateMixin(Context, A), CreateMixin(Context, A);
