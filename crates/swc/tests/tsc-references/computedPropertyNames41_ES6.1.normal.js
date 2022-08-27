//// [computedPropertyNames41_ES6.ts]
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
