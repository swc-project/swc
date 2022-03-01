//@target: ES6
class Bar {
}
class Foo extends Bar {
}
let _iterator = Symbol.iterator;
class FooIterator {
    next() {
        return {
            value: new Foo,
            done: false
        };
    }
    [_iterator]() {
        return this;
    }
}
function fun(...[a, b]) {}
fun(new FooIterator);
