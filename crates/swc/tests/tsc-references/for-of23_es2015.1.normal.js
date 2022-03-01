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
for (const v of new FooIterator){
    const v = 0; // new scope
}
