//@target: ES6
class Foo {
}
class Bar extends Foo {
}
function* g() {
    yield;
    yield new Bar;
}
