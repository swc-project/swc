class Foo {
}
let _iterator = Symbol.iterator;
for (var v of new class {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
});
