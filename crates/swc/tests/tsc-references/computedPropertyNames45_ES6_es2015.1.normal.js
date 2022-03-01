// @target: es6
class Foo {
}
class Foo2 {
}
class C {
    get ["get1"]() {
        return new Foo;
    }
}
class D extends C {
    set ["set1"](p) {}
}
