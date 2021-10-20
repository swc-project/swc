class Bar {
}
class Foo extends Bar {
}
!function(...[a, ...b]) {
}(new class {
    next() {
        return {
            value: new Foo,
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
});
