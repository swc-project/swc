//// [iterableArrayPattern20.ts]
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
function fun(...[[a = new Foo], b = [
    new Foo
]]) {}
fun(...new FooArrayIterator);
