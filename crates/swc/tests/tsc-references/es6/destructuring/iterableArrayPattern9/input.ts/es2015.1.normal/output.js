//@target: ES6
function fun([a, b] = new FooIterator) {
}
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
