class Foo {
}
var _bar = {
    writable: true,
    value: 21
};
(()=>{
    Foo.foo = _classStaticPrivateFieldSpecGet(Foo, Foo, _bar);
    Foo.qux1 = Foo.qux;
})();
_defineProperty(Foo, "qux", 21);
(()=>{
    Foo.qux2 = Foo.qux;
})();
