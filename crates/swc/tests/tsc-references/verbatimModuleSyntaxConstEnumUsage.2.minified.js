//// [verbatimModuleSyntaxConstEnumUsage.ts]
//// [foo.ts]
var Foo;
var Foo1;
export { Foo1 as Foo };
(Foo = Foo1 || (Foo1 = {}))[Foo.a = 1] = "a", Foo[Foo.b = 2] = "b", Foo[Foo.c = 3] = "c";
//// [bar.ts]
var Bar;
import { Foo } from './foo.js';
var Bar1;
export { Bar1 as Bar };
(Bar = Bar1 || (Bar1 = {}))[Bar.a = Foo.a] = "a", Bar[Bar.c = Foo.c] = "c", Bar[Bar.e = 5] = "e";
