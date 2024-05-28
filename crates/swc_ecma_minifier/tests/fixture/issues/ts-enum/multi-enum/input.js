var Foo;
(function (Foo) {
    Foo[Foo["a"] = 1] = "a";
})(Foo || (Foo = {}));
(function (Foo) {
    Foo[Foo["b"] = 2] = "b";
})(Foo || (Foo = {}));

export { Foo }