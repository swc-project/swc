class Foo {}
_defineProperty(Foo, "bar", 42);
var __ = {
    writable: true,
    value: (() => {
        Foo.foo = Foo.bar;
    })(),
};
