//@target: ES6
function fun([a, b] = new FooIterator) {}
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
