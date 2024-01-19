//// [verbatimModuleSyntaxInternalImportEquals.ts]
var Foo, Foo1;
NonExistent, Foo1 = Foo || (Foo = {}), Foo1.foo = 1, Foo.foo, Foo.T;
export { };
