// @target: es5
class Foo {
}
class Foo2 {
}
var tmp = "get1";
class C {
    get [tmp]() {
        return new Foo;
    }
}
var tmp1 = "set1";
class D extends C {
    set [tmp1](p) {
    }
}
