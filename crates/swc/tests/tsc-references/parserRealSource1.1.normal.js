//// [parserRealSource1.ts]
// Copyright (c) Microsoft. All rights reserved. Licensed under the Apache License, Version 2.0. 
// See LICENSE.txt in the project root for complete license information.
///<reference path='typescript.ts' />
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(TypeScript) {
    (function(CompilerDiagnostics) {
        CompilerDiagnostics.debug = false;
        CompilerDiagnostics.diagnosticWriter = null;
        CompilerDiagnostics.analysisPass = 0;
        function Alert(output) {
            if (CompilerDiagnostics.diagnosticWriter) {
                CompilerDiagnostics.diagnosticWriter.Alert(output);
            }
        }
        CompilerDiagnostics.Alert = Alert;
        function debugPrint(s) {
            if (CompilerDiagnostics.debug) {
                Alert(s);
            }
        }
        CompilerDiagnostics.debugPrint = debugPrint;
        function assert(condition, s) {
            if (CompilerDiagnostics.debug) {
                if (!condition) {
                    Alert(s);
                }
            }
        }
        CompilerDiagnostics.assert = assert;
    })(TypeScript.CompilerDiagnostics || (TypeScript.CompilerDiagnostics = {}));
    var NullLogger = /*#__PURE__*/ function() {
        "use strict";
        function NullLogger() {
            _class_call_check(this, NullLogger);
        }
        var _proto = NullLogger.prototype;
        _proto.information = function information() {
            return false;
        };
        _proto.debug = function debug() {
            return false;
        };
        _proto.warning = function warning() {
            return false;
        };
        _proto.error = function error() {
            return false;
        };
        _proto.fatal = function fatal() {
            return false;
        };
        _proto.log = function log(s) {};
        return NullLogger;
    }();
    TypeScript.NullLogger = NullLogger;
    var LoggerAdapter = /*#__PURE__*/ function() {
        "use strict";
        function LoggerAdapter(logger) {
            _class_call_check(this, LoggerAdapter);
            this.logger = logger;
            this._information = this.logger.information();
            this._debug = this.logger.debug();
            this._warning = this.logger.warning();
            this._error = this.logger.error();
            this._fatal = this.logger.fatal();
        }
        var _proto = LoggerAdapter.prototype;
        _proto.information = function information() {
            return this._information;
        };
        _proto.debug = function debug() {
            return this._debug;
        };
        _proto.warning = function warning() {
            return this._warning;
        };
        _proto.error = function error() {
            return this._error;
        };
        _proto.fatal = function fatal() {
            return this._fatal;
        };
        _proto.log = function log(s) {
            this.logger.log(s);
        };
        return LoggerAdapter;
    }();
    TypeScript.LoggerAdapter = LoggerAdapter;
    var BufferedLogger = /*#__PURE__*/ function() {
        "use strict";
        function BufferedLogger() {
            _class_call_check(this, BufferedLogger);
            this.logContents = [];
        }
        var _proto = BufferedLogger.prototype;
        _proto.information = function information() {
            return false;
        };
        _proto.debug = function debug() {
            return false;
        };
        _proto.warning = function warning() {
            return false;
        };
        _proto.error = function error() {
            return false;
        };
        _proto.fatal = function fatal() {
            return false;
        };
        _proto.log = function log(s) {
            this.logContents.push(s);
        };
        return BufferedLogger;
    }();
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
        var addChar = function(index) {
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
var TypeScript;
