import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript) {
    var prePrintAST = function prePrintAST(ast, parent, walker) {
        var pc = walker.state;
        ast.print(pc);
        pc.increaseIndent();
        return ast;
    };
    var postPrintAST = function postPrintAST(ast, parent, walker) {
        var pc = walker.state;
        pc.decreaseIndent();
        return ast;
    };
    var PrintContext = /*#__PURE__*/ function() {
        "use strict";
        function PrintContext(outfile, parser) {
            _class_call_check(this, PrintContext);
            this.outfile = outfile;
            this.parser = parser;
            this.builder = "";
            this.indent1 = "  ";
            this.indentStrings = [];
            this.indentAmt = 0;
        }
        var _proto = PrintContext.prototype;
        _proto.increaseIndent = function increaseIndent() {
            this.indentAmt++;
        };
        _proto.decreaseIndent = function decreaseIndent() {
            this.indentAmt--;
        };
        _proto.startLine = function startLine() {
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
        };
        _proto.write = function write(s) {
            this.builder += s;
        };
        _proto.writeLine = function writeLine(s) {
            this.builder += s;
            this.outfile.WriteLine(this.builder);
            this.builder = "";
        };
        return PrintContext;
    }();
    TypeScript.PrintContext = PrintContext;
    TypeScript.prePrintAST = prePrintAST;
    TypeScript.postPrintAST = postPrintAST;
})(TypeScript || (TypeScript = {}));
