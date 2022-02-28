class Foo {
}
let _iterator = Symbol.iterator;
for (const v of new class {
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
