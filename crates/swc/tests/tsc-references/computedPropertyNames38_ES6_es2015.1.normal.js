// @target: es6
class Foo {
}
class Foo2 {
}
class C {
    // Computed properties
    get [1 << 6]() {
        return new Foo;
    }
    set [1 << 6](p) {}
}
