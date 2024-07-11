var x;
let Foo;
(function(Foo) {
    Foo[Foo["a"] = 0] = "a";
    Foo[Foo["b"] = 0] = "b";
    Foo[Foo["c"] = 1] = "c";
    Foo[Foo["d"] = 1] = "d";
})(Foo || (Foo = {}));
