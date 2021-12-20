//@target: ES6
class Bar {
}
class Foo extends Bar {
}
var tmp = Symbol.iterator;
class FooArrayIterator {
    next() {
        return {
            value: [
                new Foo
            ],
            done: false
        };
    }
    [tmp]() {
        return this;
    }
}
function fun(...[[a = new Foo], b = [
    new Foo
]]) {
}
fun(...new FooArrayIterator);
