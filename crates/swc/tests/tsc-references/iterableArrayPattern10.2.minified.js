//// [iterableArrayPattern10.ts]
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
function fun([a, b]) {}
fun(new FooIterator);
