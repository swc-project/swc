// @strict: true
// @target: esnext
// @filename: enum.ts
export var Foo;
(function(Foo) {
    Foo[Foo["A"] = 0] = "A";
    Foo[Foo["B"] = 1] = "B";
})(Foo || (Foo = {}));
// @filename: test.ts
import { Foo } from './enum';
var Bar;
(function(Bar) {
    Bar[Bar["A"] = 0] = "A";
    Bar[Bar["B"] = 1] = "B";
})(Bar || (Bar = {}));
let foo = Foo.A;
let bar = Bar.A;
// @filename: ns.ts
var ns;
(function(ns1) {
    let Foo;
    (function(Foo) {
        Foo[Foo["X"] = 0] = "X";
    })(Foo = ns1.Foo || (ns1.Foo = {}));
    ns.Foo.X;
})(ns || (ns = {}));
// @filename: more.ts
export var Foo;
(function(Foo) {
    Foo[Foo["X"] = 0] = "X";
})(Foo || (Foo = {}));
Foo.X;
