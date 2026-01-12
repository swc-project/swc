//// [verbatimModuleSyntaxInternalImportEquals.ts]
(function(Foo) {
    Foo.foo = 1;
})(Foo || (Foo = {}));
var Foo;
export { };
