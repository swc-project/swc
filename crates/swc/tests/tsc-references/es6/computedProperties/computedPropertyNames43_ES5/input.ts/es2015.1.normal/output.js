// @target: es5
class Foo {
}
class Foo2 {
}
class C {
}
var tmp = "get1", tmp1 = "set1";
class D extends C {
    // Computed properties
    get [tmp]() {
        return new Foo;
    }
    set [tmp1](p) {
    }
}
