//// [parserRealSource5.ts]
var TypeScript, TypeScript1, PrintContext;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
TypeScript1 = TypeScript || (TypeScript = {}), PrintContext = /*#__PURE__*/ function() {
    function PrintContext(outfile, parser) {
        _class_call_check(this, PrintContext), this.outfile = outfile, this.parser = parser, this.builder = "", this.indent1 = "  ", this.indentStrings = [], this.indentAmt = 0;
    }
    var _proto = PrintContext.prototype;
    return _proto.increaseIndent = function() {
        this.indentAmt++;
    }, _proto.decreaseIndent = function() {
        this.indentAmt--;
    }, _proto.startLine = function() {
        this.builder.length > 0 && CompilerDiagnostics.Alert(this.builder);
        var indentString = this.indentStrings[this.indentAmt];
        if (void 0 === indentString) {
            indentString = "";
            for(var i = 0; i < this.indentAmt; i++)indentString += this.indent1;
            this.indentStrings[this.indentAmt] = indentString;
        }
        this.builder += indentString;
    }, _proto.write = function(s) {
        this.builder += s;
    }, _proto.writeLine = function(s) {
        this.builder += s, this.outfile.WriteLine(this.builder), this.builder = "";
    }, PrintContext;
}(), TypeScript1.PrintContext = PrintContext, TypeScript1.prePrintAST = function(ast, parent, walker) {
    var pc = walker.state;
    return ast.print(pc), pc.increaseIndent(), ast;
}, TypeScript1.postPrintAST = function(ast, parent, walker) {
    return walker.state.decreaseIndent(), ast;
};
