//// [constAssertionOnEnum.ts]
//// [enum.ts]
export var Foo;
(function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
//// [test.ts]
import { Foo } from './enum';
var Bar;
(function(Bar) {
    Bar[Bar["A"] = 0] = "A";
    Bar[Bar["B"] = 1] = "B";
})(Bar || (Bar = {}));
let foo = Foo.A;
let bar = 0;
//// [ns.ts]
var ns;
(function(ns) {
    let Foo;
    (function(Foo) {
        Foo[Foo["X"] = 0] = "X";
    })(Foo = ns.Foo || (ns.Foo = {}));
    ns.Foo.X;
})(ns || (ns = {}));
//// [more.ts]
export var Foo;
(function(Foo) {
    Foo[Foo["X"] = 0] = "X";
})(Foo || (Foo = {}));
Foo.X;
