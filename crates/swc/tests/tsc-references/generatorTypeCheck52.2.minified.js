//// [generatorTypeCheck52.ts]
class Foo {
}
class Baz {
}
function* g() {
    yield new Foo, yield new Baz;
}
