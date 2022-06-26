// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
var TypeScript;
(function(TypeScript) {
    let CompilerDiagnostics;
    (function(CompilerDiagnostics) {
        var debug = CompilerDiagnostics.debug = false;
        var diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
        var analysisPass = CompilerDiagnostics.analysisPass = 0;
        function Alert(output) {
            if (diagnosticWriter) {
                diagnosticWriter.Alert(output);
            }
        }
        CompilerDiagnostics.Alert = Alert;
        function debugPrint(s) {
            if (debug) {
                Alert(s);
            }
        }
        CompilerDiagnostics.debugPrint = debugPrint;
        function assert(condition, s) {
            if (debug) {
                if (!condition) {
                    Alert(s);
                }
            }
        }
        CompilerDiagnostics.assert = assert;
    })(CompilerDiagnostics = TypeScript.CompilerDiagnostics || (TypeScript.CompilerDiagnostics = {}));
    class NullLogger {
        information() {
            return false;
        }
        debug() {
            return false;
        }
        warning() {
            return false;
        }
        error() {
            return false;
        }
        fatal() {
            return false;
        }
        log(s) {}
    }
    TypeScript.NullLogger = NullLogger;
    class LoggerAdapter {
        information() {
            return this._information;
        }
        debug() {
            return this._debug;
        }
        warning() {
            return this._warning;
        }
        error() {
            return this._error;
        }
        fatal() {
            return this._fatal;
        }
        log(s) {
            this.logger.log(s);
        }
        constructor(logger){
            this.logger = logger;
            this._information = this.logger.information();
            this._debug = this.logger.debug();
            this._warning = this.logger.warning();
            this._error = this.logger.error();
            this._fatal = this.logger.fatal();
        }
    }
    TypeScript.LoggerAdapter = LoggerAdapter;
    class BufferedLogger {
        information() {
            return false;
        }
        debug() {
            return false;
        }
        warning() {
            return false;
        }
        error() {
            return false;
        }
        fatal() {
            return false;
        }
        log(s) {
            this.logContents.push(s);
        }
        constructor(){
            this.logContents = [];
        }
    }
    TypeScript.BufferedLogger = BufferedLogger;
    function timeFunction(logger, funcDescription, func) {
        var start = +new Date();
        var result = func();
        var end = +new Date();
        logger.log(funcDescription + " completed in " + (end - start) + " msec");
        return result;
    }
    TypeScript.timeFunction = timeFunction;
    function stringToLiteral(value, length) {
        var result = "";
        var addChar = (index)=>{
            var ch = value.charCodeAt(index);
            switch(ch){
                case 0x09:
                    result += "\\t";
                    break;
                case 0x0a:
                    result += "\\n";
                    break;
                case 0x0b:
                    result += "\\v";
                    break;
                case 0x0c:
                    result += "\\f";
                    break;
                case 0x0d:
                    result += "\\r";
                    break;
                case 0x22:
                    result += "\\\"";
                    break;
                case 0x27:
                    result += "\\\'";
                    break;
                case 0x5c:
                    result += "\\";
                    break;
                default:
                    result += value.charAt(index);
            }
        };
        var tooLong = value.length > length;
        if (tooLong) {
            var mid = length >> 1;
            for(var i = 0; i < mid; i++)addChar(i);
            result += "(...)";
            for(var i = value.length - mid; i < value.length; i++)addChar(i);
        } else {
            length = value.length;
            for(var i = 0; i < length; i++)addChar(i);
        }
        return result;
    }
    TypeScript.stringToLiteral = stringToLiteral;
})(TypeScript || (TypeScript = {}));
