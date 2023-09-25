//// [verbatimModuleSyntaxInternalImportEquals.ts]
export { };
var f1 = NonExistent;
var Foo;
(function(Foo) {
    var foo = Foo.foo = 1;
})(Foo || (Foo = {}));
var f2 = Foo.foo;
var f3 = Foo.T;
