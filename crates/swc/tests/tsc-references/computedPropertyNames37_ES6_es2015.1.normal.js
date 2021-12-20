// @target: es6
class Foo {
}
class Foo2 {
}
var tmp = "get1", tmp1 = "set1";
class C {
    // Computed properties
    get [tmp]() {
        return new Foo;
    }
    set [tmp1](p) {
    }
}
