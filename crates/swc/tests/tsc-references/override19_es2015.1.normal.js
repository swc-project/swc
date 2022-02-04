class Context {
}
class A {
    doSomething() {}
}
class B extends CreateMixin(Context, A) {
    foo() {}
}
class C extends CreateMixin(Context, A) {
    doSomethang() {}
}
