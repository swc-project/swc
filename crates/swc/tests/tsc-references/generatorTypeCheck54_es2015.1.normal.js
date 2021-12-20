//@target: ES6
class Foo {
}
class Baz {
}
function* g() {
    yield* [
        new Foo
    ];
    yield* [
        new Baz
    ];
}
