var __ = new WeakMap();
class Foo {
}
_define_property(Foo, "bar", 42);
__.set(Foo, {
    writable: true,
    value: Foo.foo = Foo.bar
});
