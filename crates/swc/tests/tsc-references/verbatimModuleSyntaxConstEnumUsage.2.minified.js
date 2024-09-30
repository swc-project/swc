//// [verbatimModuleSyntaxConstEnumUsage.ts]
//// [foo.ts]
var Foo;
var Foo1 = ((Foo = {})[Foo.a = 1] = "a", Foo[Foo.b = 2] = "b", Foo[Foo.c = 3] = "c", Foo);
export { Foo1 as Foo,  };
//// [bar.ts]
var Bar;
import { Foo } from './foo.js';
var Bar1 = ((Bar = {})[Bar.a = Foo.a] = "a", Bar[Bar.c = Foo.c] = "c", Bar[Bar.e = 5] = "e", Bar);
export { Bar1 as Bar,  };
