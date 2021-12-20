class Bar {
}
class Foo extends Bar {
}
var tmp = Symbol.iterator;
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
}
!function([a, b] = new FooIterator) {
}(new FooIterator);
