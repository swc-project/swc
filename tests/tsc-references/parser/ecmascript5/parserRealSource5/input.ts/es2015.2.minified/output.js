var TypeScript, TypeScript1;
(TypeScript1 = TypeScript || (TypeScript = {
})).PrintContext = class {
    increaseIndent() {
        this.indentAmt++;
    }
    decreaseIndent() {
        this.indentAmt--;
    }
    startLine() {
        this.builder.length > 0 && CompilerDiagnostics.Alert(this.builder);
        var indentString = this.indentStrings[this.indentAmt];
        if (void 0 === indentString) {
            indentString = "";
            for(var i = 0; i < this.indentAmt; i++)indentString += this.indent1;
            this.indentStrings[this.indentAmt] = indentString;
        }
        this.builder += indentString;
    }
    write(s) {
        this.builder += s;
    }
    writeLine(s1) {
        this.builder += s1, this.outfile.WriteLine(this.builder), this.builder = "";
    }
    constructor(outfile, parser){
        this.outfile = outfile, this.parser = parser, this.builder = "", this.indent1 = "  ", this.indentStrings = [], this.indentAmt = 0;
    }
}, TypeScript1.prePrintAST = function(ast, parent, walker) {
    var pc = walker.state;
    return ast.print(pc), pc.increaseIndent(), ast;
}, TypeScript1.postPrintAST = function(ast, parent, walker) {
    return walker.state.decreaseIndent(), ast;
};
