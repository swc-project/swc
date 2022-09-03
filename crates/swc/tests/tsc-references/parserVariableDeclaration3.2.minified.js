//// [parserVariableDeclaration3.ts]
function runTests() {
    new Harness.Compiler.WriterAggregator();
    var outerr = new Harness.Compiler.WriterAggregator();
    new TypeScript.TypeScriptCompiler(outerr);
}
