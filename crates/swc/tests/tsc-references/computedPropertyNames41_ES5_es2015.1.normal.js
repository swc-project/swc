// @target: es5
class Foo {
}
class Foo2 {
}
var tmp = "";
class C {
    // Computed properties
    static [tmp]() {
        return new Foo;
    }
}
