class Foo {
}
var _bar = {
    writable: true,
    value: 21
};
var __ = {
    writable: true,
    value: (()=>{
        Foo.foo = _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
        Foo.qux1 = Foo.qux;
    })()
};
_defineProperty(Foo, "qux", 21);
var __1 = {
    writable: true,
    value: (()=>{
        Foo.qux2 = Foo.qux;
    })()
};
