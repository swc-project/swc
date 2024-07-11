let Foo;
(function(Foo) {
    Foo[Foo["a"] = 0] = "a";
})(Foo || (Foo = {}));
