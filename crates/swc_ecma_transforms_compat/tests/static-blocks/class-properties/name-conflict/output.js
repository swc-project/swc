var __ = new WeakMap(), __2 = new WeakMap();
class Foo {
}
__.set(Foo, {
    writable: true,
    value: 42
});
__2.set(Foo, {
    writable: true,
    value: Foo.foo = _class_private_field_get(Foo, __)
});
