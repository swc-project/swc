//// [verbatimModuleSyntaxInternalImportEquals.ts]
export { };
var f1 = NonExistent;
(function(Foo) {
    Foo.foo = 1;
})(Foo || (Foo = {}));
var f2 = Foo.foo;
var f3 = Foo.T;
var Foo;
