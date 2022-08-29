//// [generatorTypeCheck25.ts]
class Foo {
}
class Bar extends Foo {
}
class Baz {
}
var g3 = function*() {
    yield;
    yield new Bar;
    yield new Baz;
    yield* [
        new Bar
    ];
    yield* [
        new Baz
    ];
};
