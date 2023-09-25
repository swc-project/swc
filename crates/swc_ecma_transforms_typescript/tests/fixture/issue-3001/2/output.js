var x = 10;
var Foo;
(function(Foo) {
    Foo[Foo["a"] = 10] = "a";
    Foo[Foo["b"] = 10] = "b";
    Foo[Foo["c"] = 10 + x] = "c";
    Foo[Foo["d"] = Foo.c] = "d";
})(Foo || (Foo = {}));
var Bar;
(function(Bar) {
    Bar[Bar["a"] = 1] = "a";
    Bar[Bar["b"] = 10] = "b";
    Bar[Bar["E"] = 10] = "E";
    Bar[Bar["F"] = Math.E] = "F";
})(Bar || (Bar = {}));
var Baz;
(function(Baz) {
    Baz[Baz["a"] = 0] = "a";
    Baz[Baz["b"] = 1] = "b";
    // @ts-ignore
    Baz[Baz["x"] = 0..toString()] = "x";
})(Baz || (Baz = {}));
