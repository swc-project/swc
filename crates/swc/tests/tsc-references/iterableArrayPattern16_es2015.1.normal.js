//@target: ES6
function fun(...[a, b]) {}
fun(...new FooIteratorIterator);
class Bar {
}
class Foo extends Bar {
}
let _iterator = Symbol.iterator;
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: false
        };
    }
    [_iterator]() {
        return this;
    }
}
let _iterator1 = Symbol.iterator;
class FooIteratorIterator {
    next() {
        return {
            value: new FooIterator,
            done: false
        };
    }
    [_iterator1]() {
        return this;
    }
}
