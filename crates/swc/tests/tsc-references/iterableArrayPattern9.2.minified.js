//// [iterableArrayPattern9.ts]
function fun([a, b] = new FooIterator) {}
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
