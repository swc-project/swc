!function(...[a, b]) {}(...new FooIteratorIterator);
class Bar {
}
class Foo extends Bar {
}
let _iterator = Symbol.iterator;
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: !1
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
            done: !1
        };
    }
    [_iterator1]() {
        return this;
    }
}
