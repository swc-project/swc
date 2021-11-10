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
    var timeFunction = function timeFunction(logger, funcDescription, func) {
        var start = +new Date();
        var result = func();
        var end = +new Date();
        logger.log(funcDescription + " completed in " + (end - start) + " msec");
        return result;
    };
    var stringToLiteral = function stringToLiteral(value, length) {
        var result = "";
        var addChar = function(index) {
            var ch = value.charCodeAt(index);
            switch(ch){
                case 9:
                    result += "\\t";
                    break;
                case 10:
                    result += "\\n";
                    break;
                case 11:
                    result += "\\v";
                    break;
                case 12:
                    result += "\\f";
                    break;
                case 13:
                    result += "\\r";
                    break;
                case 34:
                    result += "\\\"";
                    break;
                case 39:
                    result += "\\'";
                    break;
                case 92:
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
    };
    var CompilerDiagnostics1;
    (function(CompilerDiagnostics) {
        CompilerDiagnostics.debug = false;
        CompilerDiagnostics.diagnosticWriter = null;
        CompilerDiagnostics.analysisPass = 0;
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
    })(CompilerDiagnostics1 || (CompilerDiagnostics1 = {
    }));
    var NullLogger = /*#__PURE__*/ function() {
        "use strict";
        function NullLogger() {
            _classCallCheck(this, NullLogger);
        }
        _createClass(NullLogger, [
            {
                key: "information",
                value: function information() {
                    return false;
                }
            },
            {
                key: "debug",
                value: function debug() {
                    return false;
                }
            },
            {
                key: "warning",
                value: function warning() {
                    return false;
                }
            },
            {
                key: "error",
                value: function error() {
                    return false;
                }
            },
            {
                key: "fatal",
                value: function fatal() {
                    return false;
                }
            },
            {
                key: "log",
                value: function log(s) {
                }
            }
        ]);
        return NullLogger;
    }();
    TypeScript.NullLogger = NullLogger;
    var LoggerAdapter = /*#__PURE__*/ function() {
        "use strict";
        function LoggerAdapter(logger) {
            _classCallCheck(this, LoggerAdapter);
            this.logger = logger;
            this._information = this.logger.information();
            this._debug = this.logger.debug();
            this._warning = this.logger.warning();
            this._error = this.logger.error();
            this._fatal = this.logger.fatal();
        }
        _createClass(LoggerAdapter, [
            {
                key: "information",
                value: function information() {
                    return this._information;
                }
            },
            {
                key: "debug",
                value: function debug() {
                    return this._debug;
                }
            },
            {
                key: "warning",
                value: function warning() {
                    return this._warning;
                }
            },
            {
                key: "error",
                value: function error() {
                    return this._error;
                }
            },
            {
                key: "fatal",
                value: function fatal() {
                    return this._fatal;
                }
            },
            {
                key: "log",
                value: function log(s) {
                    this.logger.log(s);
                }
            }
        ]);
        return LoggerAdapter;
    }();
    TypeScript.LoggerAdapter = LoggerAdapter;
    var BufferedLogger = /*#__PURE__*/ function() {
        "use strict";
        function BufferedLogger() {
            _classCallCheck(this, BufferedLogger);
            this.logContents = [];
        }
        _createClass(BufferedLogger, [
            {
                key: "information",
                value: function information() {
                    return false;
                }
            },
            {
                key: "debug",
                value: function debug() {
                    return false;
                }
            },
            {
                key: "warning",
                value: function warning() {
                    return false;
                }
            },
            {
                key: "error",
                value: function error() {
                    return false;
                }
            },
            {
                key: "fatal",
                value: function fatal() {
                    return false;
                }
            },
            {
                key: "log",
                value: function log(s) {
                    this.logContents.push(s);
                }
            }
        ]);
        return BufferedLogger;
    }();
    TypeScript.BufferedLogger = BufferedLogger;
    TypeScript.timeFunction = timeFunction;
    TypeScript.stringToLiteral = stringToLiteral;
    TypeScript.CompilerDiagnostics = CompilerDiagnostics1;
})(TypeScript1 || (TypeScript1 = {
}));
