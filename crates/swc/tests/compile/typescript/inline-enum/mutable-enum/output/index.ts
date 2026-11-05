var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["hello"] = 42] = "hello";
    return Foo;
}(Foo || {});
Foo.hello = 0;
console.log(Foo.hello);
