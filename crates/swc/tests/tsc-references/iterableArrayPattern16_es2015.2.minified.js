!function(...[a, b]) {
}(...new FooIteratorIterator);
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
var tmp1 = Symbol.iterator;
class FooIteratorIterator {
    next() {
        return {
            value: new FooIterator,
            done: !1
        };
    }
    [tmp1]() {
        return this;
    }
}
