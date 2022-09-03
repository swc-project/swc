//// [computedPropertyNames43_ES6.ts]
class Foo {
}
class Foo2 {
}
class C {
}
class D extends C {
    get get1() {
        return new Foo;
    }
    set set1(p) {}
}
