// @target: es5
class Foo {
}
class Foo2 {
}
let tmp = 1 << 6, tmp1 = 1 << 6;
class C {
    // Computed properties
    get [tmp]() {
        return new Foo;
    }
    set [tmp1](p) {}
}
