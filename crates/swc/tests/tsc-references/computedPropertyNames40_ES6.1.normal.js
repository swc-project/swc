//// [computedPropertyNames40_ES6.ts]
class Foo {
}
class Foo2 {
}
class C {
    // Computed properties
    [""]() {
        return new Foo;
    }
    [""]() {
        return new Foo2;
    }
}
