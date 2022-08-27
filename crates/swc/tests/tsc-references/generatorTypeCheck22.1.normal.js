//// [generatorTypeCheck22.ts]
class Foo {
}
class Bar extends Foo {
}
class Baz {
}
function* g3() {
    yield;
    yield new Bar;
    yield new Baz;
    yield* [
        new Bar
    ];
    yield* [
        new Baz
    ];
}
