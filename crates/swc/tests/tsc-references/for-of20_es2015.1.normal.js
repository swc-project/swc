//@target: ES6
class Foo {
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
for (let v of new FooIterator){
    v;
}
