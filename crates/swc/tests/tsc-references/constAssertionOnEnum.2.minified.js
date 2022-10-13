//// [constAssertionOnEnum.ts]
//// [enum.ts]
export var Foo;
!function(Foo) {
    Foo[Foo.A = 0] = "A", Foo[Foo.B = 1] = "B";
}(Foo || (Foo = {}));
//// [test.ts]
var Bar;
import { Foo } from './enum';
!function(Bar) {
    Bar[Bar.A = 0] = "A", Bar[Bar.B = 1] = "B";
}(Bar || (Bar = {})), Foo.A, Bar.A;
//// [ns.ts]
var ns;
!function(ns1) {
    var Foo;
    (Foo = ns1.Foo || (ns1.Foo = {}))[Foo.X = 0] = "X", ns.Foo.X;
}(ns || (ns = {}));
//// [more.ts]
export var Foo;
!function(Foo) {
    Foo[Foo.X = 0] = "X";
}(Foo || (Foo = {})), Foo.X;
