// @target: es6
class Foo {
}
class Foo2 {
}
class C {
    // Computed properties
    static [""]() {
        return new Foo;
    }
}
