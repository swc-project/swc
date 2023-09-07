var x = 4;
var Foo;
(function(Foo) {
    Foo[Foo["a"] = 0] = "a";
    Foo[Foo["b"] = 0] = "b";
    Foo[Foo["c"] = 1] = "c";
    Foo[Foo["d"] = 1 + 1 * x] = "d";
    Foo[Foo["e"] = 2 * Foo.d] = "e";
    Foo[Foo["f"] = Foo.e * 10] = "f";
})(Foo || (Foo = {}));
