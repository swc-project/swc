var _bar = new WeakMap(), __ = new WeakMap(), __2 = new WeakMap();
class Foo {
}
_bar.set(Foo, {
    writable: true,
    value: 21
});
__.set(Foo, {
    writable: true,
    value: (()=>{
        Foo.foo = _class_private_field_get(Foo, _bar);
        Foo.qux1 = Foo.qux;
    })()
});
_define_property(Foo, "qux", 21);
__2.set(Foo, {
    writable: true,
    value: Foo.qux2 = Foo.qux
});
