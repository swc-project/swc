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
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
!function(...[[a = new Foo], b = [
    new Foo
]]) {}(...new FooArrayIterator);
