class Foo {
}
var tmp = Symbol.iterator;
for (let v of new class {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
});
