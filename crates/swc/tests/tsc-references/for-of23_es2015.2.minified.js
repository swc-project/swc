class Foo {
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
for (const v of new FooIterator);
