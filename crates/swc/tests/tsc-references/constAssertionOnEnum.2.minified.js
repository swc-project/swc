//// [constAssertionOnEnum.ts]
//// [enum.ts]
var Foo;
var Foo1;
export { Foo1 as Foo };
(Foo = Foo1 || (Foo1 = {}))[Foo.A = 0] = "A", Foo[Foo.B = 1] = "B";
//// [test.ts]
var Bar, Bar1;
import { Foo } from './enum';
(Bar1 = Bar || (Bar = {}))[Bar1.A = 0] = "A", Bar1[Bar1.B = 1] = "B", Foo.A;
//// [ns.ts]
var ns, ns1, Foo;
(Foo = (ns1 = ns || (ns = {})).Foo || (ns1.Foo = {}))[Foo.X = 0] = "X", ns1.Foo.X;
//// [more.ts]
var Foo;
var Foo1;
export { Foo1 as Foo };
(Foo = Foo1 || (Foo1 = {}))[Foo.X = 0] = "X", Foo1.X;
