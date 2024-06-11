//// [verbatimModuleSyntaxInternalImportEquals.ts]
var Foo;
NonExistent, (Foo || (Foo = {})).foo = 1, Foo.foo, Foo.T;
export { };
