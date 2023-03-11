class Foo {
}
_defineProperty(Foo, "bar", 42);
(()=>{
    Foo.foo = Foo.bar;
})();
