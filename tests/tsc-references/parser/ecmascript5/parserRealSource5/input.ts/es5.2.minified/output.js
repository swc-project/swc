var TypeScript1;
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
!function(TypeScript) {
    var PrintContext = function() {
        "use strict";
        var Constructor, protoProps, staticProps;
        function PrintContext(outfile, parser) {
            !function(instance, Constructor) {
                if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
            }(this, PrintContext), this.outfile = outfile, this.parser = parser, this.builder = "", this.indent1 = "  ", this.indentStrings = [], this.indentAmt = 0;
        }
        return Constructor = PrintContext, protoProps = [
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
        ], _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), PrintContext;
    }();
    TypeScript.PrintContext = PrintContext, TypeScript.prePrintAST = function(ast, parent, walker) {
        var pc = walker.state;
        return ast.print(pc), pc.increaseIndent(), ast;
    }, TypeScript.postPrintAST = function(ast, parent, walker) {
        return walker.state.decreaseIndent(), ast;
    };
}(TypeScript1 || (TypeScript1 = {
}));
