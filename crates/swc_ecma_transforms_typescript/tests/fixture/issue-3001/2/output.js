var x = 10;
var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["a"] = 10] = "a";
    Foo[Foo["b"] = 10] = "b";
    Foo[Foo["c"] = b + x] = "c";
    Foo[Foo["d"] = c] = "d";
    return Foo;
}(Foo || {});
var Bar = /*#__PURE__*/ function(Bar) {
    Bar[Bar["a"] = 1] = "a";
    Bar[Bar["b"] = Foo.a] = "b";
    Bar[Bar["E"] = b] = "E";
    Bar[Bar["F"] = Math.E] = "F";
    return Bar;
}(Bar || {});
var Baz = /*#__PURE__*/ function(Baz) {
    Baz[Baz["a"] = 0] = "a";
    Baz[Baz["b"] = 1] = "b";
    Baz[Baz["x"] = a.toString()] = "x";
    return Baz;
}(Baz || {});
