//@target: ES6
function fun(...[a, b]) {
}
fun(...new FooIteratorIterator);
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
var tmp1 = Symbol.iterator;
class FooIteratorIterator {
    next() {
        return {
            value: new FooIterator,
            done: false
        };
    }
    [tmp1]() {
        return this;
    }
}
