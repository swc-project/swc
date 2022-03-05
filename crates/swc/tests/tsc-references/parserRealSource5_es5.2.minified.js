var TypeScript;
import * as swcHelpers from "@swc/helpers";
!function(TypeScript1) {
    var PrintContext = function() {
        "use strict";
        function PrintContext(outfile, parser) {
            swcHelpers.classCallCheck(this, PrintContext), this.outfile = outfile, this.parser = parser, this.builder = "", this.indent1 = "  ", this.indentStrings = [], this.indentAmt = 0;
        }
        return swcHelpers.createClass(PrintContext, [
            {
                key: "increaseIndent",
                value: function() {
                    this.indentAmt++;
                }
            },
            {
                key: "decreaseIndent",
                value: function() {
                    this.indentAmt--;
                }
            },
            {
                key: "startLine",
                value: function() {
                    this.builder.length > 0 && CompilerDiagnostics.Alert(this.builder);
                    var indentString = this.indentStrings[this.indentAmt];
                    if (void 0 === indentString) {
                        indentString = "";
                        for(var i = 0; i < this.indentAmt; i++)indentString += this.indent1;
                        this.indentStrings[this.indentAmt] = indentString;
                    }
                    this.builder += indentString;
                }
            },
            {
                key: "write",
                value: function(s) {
                    this.builder += s;
                }
            },
            {
                key: "writeLine",
                value: function(s) {
                    this.builder += s, this.outfile.WriteLine(this.builder), this.builder = "";
                }
            }
        ]), PrintContext;
    }();
    TypeScript1.PrintContext = PrintContext, TypeScript1.prePrintAST = function(ast, parent, walker) {
        var pc = walker.state;
        return ast.print(pc), pc.increaseIndent(), ast;
    }, TypeScript1.postPrintAST = function(ast, parent, walker) {
        return walker.state.decreaseIndent(), ast;
    };
}(TypeScript || (TypeScript = {}));
