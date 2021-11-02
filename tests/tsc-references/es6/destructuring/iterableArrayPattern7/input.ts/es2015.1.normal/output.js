//@target: ES6
class Bar {
}
class Foo extends Bar {
}
var tmp = Symbol.iterator;
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: false
        };
    }
    [tmp]() {
        return this;
    }
}
var a, b;
[a, b] = new FooIterator;
