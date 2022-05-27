//@target: ES6
function fun(...[a, b]) {}
fun(...new FooIteratorIterator);
class Bar {
}
class Foo extends Bar {
}
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
class FooIteratorIterator {
    next() {
        return {
            value: new FooIterator,
            done: false
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
