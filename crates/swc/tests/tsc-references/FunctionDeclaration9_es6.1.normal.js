//// [FunctionDeclaration9_es6.ts]
function* foo() {
    var v = {
        [yield]: foo
    };
}
