var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["a"] = 0] = "a";
    Foo[Foo["b"] = 1] = "b";
    return Foo;
}(Foo || {});
var Bar = /*#__PURE__*/ function(Bar) {
    Bar["a"] = "A";
    Bar["b"] = "B";
    return Bar;
}(Bar || {});
var Baz = /*#__PURE__*/ function(Baz) {
    Baz[Baz["a"] = 42] = "a";
    Baz[Baz["b"] = 43] = "b";
    return Baz;
}(Baz || {});

