//// [verbatimModuleSyntaxInternalImportEquals.ts]
var Foo;
(function(Foo) {
    var foo = Foo.foo = 1;
})(Foo || (Foo = {}));
export { };
