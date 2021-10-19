class Bar {
}
class Foo extends Bar {
}
!function(...[[a = new Foo], b = [
    new Foo
]]) {
}(...new class {
    next() {
        return {
            value: [
                new Foo
            ],
            done: !1
        };
    }
    [Symbol.iterator]() {
        return this;
    }
});
