var a, b;
class Bar {
}
class Foo extends Bar {
}
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
[a, ...b] = new FooIterator;
