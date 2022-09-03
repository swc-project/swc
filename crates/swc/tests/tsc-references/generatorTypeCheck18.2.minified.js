//// [generatorTypeCheck18.ts]
class Foo {
}
class Baz {
}
function* g() {
    yield, yield new Baz;
}
