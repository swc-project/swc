var x = 4;
var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["a"] = 0] = "a";
    Foo[Foo["b"] = 0] = "b";
    Foo[Foo["c"] = 1] = "c";
    Foo[Foo["d"] = 1 + Foo.c * x] = "d";
    Foo[Foo["e"] = 2 * Foo.d] = "e";
    Foo[Foo["f"] = Foo.e * 10] = "f";
    return Foo;
}(Foo || {});
