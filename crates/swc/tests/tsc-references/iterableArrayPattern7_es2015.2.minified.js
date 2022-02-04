class Bar {
}
class Foo extends Bar {
}
var a, b, tmp = Symbol.iterator;
[a, b] = new class {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [tmp]() {
        return this;
    }
};
