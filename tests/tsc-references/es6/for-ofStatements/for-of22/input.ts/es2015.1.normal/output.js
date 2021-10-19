//@target: ES6
class Foo {
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
v;
for (var v of new FooIterator){
}
