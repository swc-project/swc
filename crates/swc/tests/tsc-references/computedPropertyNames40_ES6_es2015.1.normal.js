// @target: es6
class Foo {
}
class Foo2 {
}
var tmp = "", tmp1 = "";
class C {
    // Computed properties
    [tmp]() {
        return new Foo;
    }
    [tmp1]() {
        return new Foo2;
    }
}
