var x = 10;
var Foo;
(function(Foo) {
    Foo[Foo["a"] = 10] = "a";
    Foo[Foo["b"] = 10] = "b";
    Foo[Foo["c"] = Foo.b + x] = "c";
    Foo[Foo["d"] = Foo.c] = "d";
})(Foo || (Foo = {}));
var Bar;
(function(Bar) {
    Bar[Bar["a"] = 1] = "a";
    Bar[Bar["b"] = Foo.a] = "b";
    Bar[Bar["E"] = Bar.b] = "E";
    Bar[Bar["F"] = Math.E] = "F";
})(Bar || (Bar = {}));
var Baz;
(function(Baz) {
    Baz[Baz["a"] = 0] = "a";
    Baz[Baz["b"] = 1] = "b";
    Baz[Baz[// @ts-ignore
    "x"] = Baz.a.toString()] = "x";
})(Baz || (Baz = {}));
