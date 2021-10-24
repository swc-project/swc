class Foo {}
var __ = {
    writable: true,
    value: 42,
};
var __1 = {
    writable: true,
    value: (() => {
        Foo.foo = Foo.#_;
    })(),
};
