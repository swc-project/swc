var a, b;
class Bar {
}
class Foo extends Bar {
}
let _iterator = Symbol.iterator;
[a, ...b] = new class {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [_iterator]() {
        return this;
    }
};
