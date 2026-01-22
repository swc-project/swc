var _initStaticBlock0;
class Foo {
}
var _bar = {
    writable: true,
    value: 21
};
(()=>{
    Foo.foo = _class_static_private_field_spec_get(Foo, Foo, _bar);
    Foo.qux1 = Foo.qux;
})();
_define_property(Foo, "qux", 21);
_initStaticBlock0 = ()=>{
    Foo.qux2 = Foo.qux;
};
_initStaticBlock0.call(Foo);
