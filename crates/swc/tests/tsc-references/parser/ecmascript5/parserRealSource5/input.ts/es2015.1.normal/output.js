// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript1) {
    class PrintContext {
        increaseIndent() {
            this.indentAmt++;
        }
        decreaseIndent() {
            this.indentAmt--;
        }
        startLine() {
            if (this.builder.length > 0) {
                CompilerDiagnostics.Alert(this.builder);
            }
            var indentString = this.indentStrings[this.indentAmt];
            if (indentString === undefined) {
                indentString = "";
                for(var i = 0; i < this.indentAmt; i++){
                    indentString += this.indent1;
                }
                this.indentStrings[this.indentAmt] = indentString;
            }
            this.builder += indentString;
        }
        write(s) {
            this.builder += s;
        }
        writeLine(s) {
            this.builder += s;
            this.outfile.WriteLine(this.builder);
            this.builder = "";
        }
        constructor(outfile, parser){
            this.outfile = outfile;
            this.parser = parser;
            this.builder = "";
            this.indent1 = "  ";
            this.indentStrings = [];
            this.indentAmt = 0;
        }
    }
    TypeScript1.PrintContext = PrintContext;
    function prePrintAST(ast, parent, walker) {
        var pc = walker.state;
        ast.print(pc);
        pc.increaseIndent();
        return ast;
    }
    TypeScript1.prePrintAST = prePrintAST;
    function postPrintAST(ast, parent, walker) {
        var pc = walker.state;
        pc.decreaseIndent();
        return ast;
    }
    TypeScript1.postPrintAST = postPrintAST;
})(TypeScript || (TypeScript = {
}));
