//@target: ES6
class Bar {
}
class Foo extends Bar {
}
class FooArrayIterator {
    next() {
        return {
            value: [
                new Foo
            ],
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
function fun([[a], b]) {}
fun(new FooArrayIterator);
