//// [generatorTypeCheck19.ts]
class Foo {
}
class Bar extends Foo {
}
function* g() {
    yield;
    yield* [
        new Bar
    ];
}
