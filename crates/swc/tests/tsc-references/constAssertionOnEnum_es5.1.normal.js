export var Foo;
(function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
var Bar;
(function(Bar) {
    Bar[Bar["A"] = 0] = "A";
    Bar[Bar["B"] = 1] = "B";
})(Bar || (Bar = {}));
var foo = Foo.A;
var bar = Bar.A;
// @filename: ns.ts
var ns;
(function(ns1) {
    var Foo;
    (function(Foo) {
        Foo[Foo["X"] = 0] = "X";
    })(Foo = ns1.Foo || (ns1.Foo = {}));
    ns.Foo.X;
})(ns || (ns = {}));
(function(Foo) {
    Foo[Foo["X"] = 0] = "X";
})(Foo || (Foo = {}));
Foo.X;
