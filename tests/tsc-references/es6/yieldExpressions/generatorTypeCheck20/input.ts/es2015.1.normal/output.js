//@target: ES6
class Foo {
}
class Baz {
}
function* g() {
    yield;
    yield* [
        new Baz
    ];
}
