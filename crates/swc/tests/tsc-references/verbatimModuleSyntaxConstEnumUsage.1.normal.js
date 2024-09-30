//// [verbatimModuleSyntaxConstEnumUsage.ts]
//// [foo.ts]
export var Foo = /*#__PURE__*/ function(Foo) {
    Foo[Foo["a"] = 1] = "a";
    Foo[Foo["b"] = 2] = "b";
    Foo[Foo["c"] = 3] = "c";
    return Foo;
}({});
//// [bar.ts]
import { Foo } from './foo.js';
export var Bar = /*#__PURE__*/ function(Bar) {
    Bar[Bar["a"] = Foo.a] = "a";
    Bar[Bar["c"] = Foo.c] = "c";
    Bar[Bar["e"] = 5] = "e";
    return Bar;
}({});
