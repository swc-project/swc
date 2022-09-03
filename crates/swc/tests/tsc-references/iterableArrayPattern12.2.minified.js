//// [iterableArrayPattern12.ts]
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
function fun([a, ...b] = new FooIterator) {}
fun(new FooIterator);
