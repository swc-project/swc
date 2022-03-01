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
!function([a, ...b] = new FooIterator) {}(new FooIterator);
