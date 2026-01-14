var x = 10;
var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["a"] = 10] = "a";
    Foo[Foo["b"] = 10] = "b";
    Foo[Foo["c"] = 10 + x] = "c";
    Foo[Foo["d"] = Foo.c] = "d";
    return Foo;
}(Foo || {});
var Bar = /*#__PURE__*/ function(Bar) {
    Bar[Bar["a"] = 1] = "a";
    Bar[Bar["b"] = 10] = "b";
    Bar[Bar["E"] = 10] = "E";
    Bar[Bar["F"] = Math.E] = "F";
    return Bar;
}(Bar || {});
var Baz = /*#__PURE__*/ function(Baz) {
    Baz[Baz["a"] = 0] = "a";
    Baz[Baz["b"] = 1] = "b";
    // @ts-ignore
    Baz[Baz["x"] = Baz.a.toString()] = "x";
    return Baz;
}(Baz || {});
