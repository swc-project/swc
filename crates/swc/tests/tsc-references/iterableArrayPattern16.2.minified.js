//// [iterableArrayPattern16.ts]
function fun(...[a, b]) {}
fun(...new FooIteratorIterator);
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
class FooIteratorIterator {
    next() {
        return {
            value: new FooIterator,
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
}
