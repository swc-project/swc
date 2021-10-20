function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript1;
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
            _classCallCheck(this, PrintContext);
            this.outfile = outfile;
            this.parser = parser;
            this.builder = "";
            this.indent1 = "  ";
            this.indentStrings = [];
            this.indentAmt = 0;
        }
        _createClass(PrintContext, [
            {
                key: "increaseIndent",
                value: function increaseIndent() {
                    this.indentAmt++;
                }
            },
            {
                key: "decreaseIndent",
                value: function decreaseIndent() {
                    this.indentAmt--;
                }
            },
            {
                key: "startLine",
                value: function startLine() {
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
            },
            {
                key: "write",
                value: function write(s) {
                    this.builder += s;
                }
            },
            {
                key: "writeLine",
                value: function writeLine(s) {
                    this.builder += s;
                    this.outfile.WriteLine(this.builder);
                    this.builder = "";
                }
            }
        ]);
        return PrintContext;
    }();
    TypeScript.PrintContext = PrintContext;
    TypeScript.prePrintAST = prePrintAST;
    TypeScript.postPrintAST = postPrintAST;
})(TypeScript1 || (TypeScript1 = {
}));
