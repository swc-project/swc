var TypeScript;
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    return protoProps && _defineProperties(Constructor.prototype, protoProps), staticProps && _defineProperties(Constructor, staticProps), Constructor;
}
!function(TypeScript1) {
    !function(CompilerDiagnostics) {
        var debug = CompilerDiagnostics.debug = !1, diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
        function Alert(output) {
            diagnosticWriter && diagnosticWriter.Alert(output);
        }
        CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
            debug && Alert(s);
        }, CompilerDiagnostics.assert = function(condition, s) {
            debug && (condition || Alert(s));
        };
    }(TypeScript1.CompilerDiagnostics || (TypeScript1.CompilerDiagnostics = {}));
    var NullLogger = function() {
        "use strict";
        function NullLogger() {
            _classCallCheck(this, NullLogger);
        }
        return _createClass(NullLogger, [
            {
                key: "information",
                value: function() {
                    return !1;
                }
            },
            {
                key: "debug",
                value: function() {
                    return !1;
                }
            },
            {
                key: "warning",
                value: function() {
                    return !1;
                }
            },
            {
                key: "error",
                value: function() {
                    return !1;
                }
            },
            {
                key: "fatal",
                value: function() {
                    return !1;
                }
            },
            {
                key: "log",
                value: function(s) {}
            }
        ]), NullLogger;
    }();
    TypeScript1.NullLogger = NullLogger;
    var LoggerAdapter = function() {
        "use strict";
        function LoggerAdapter(logger) {
            _classCallCheck(this, LoggerAdapter), this.logger = logger, this._information = this.logger.information(), this._debug = this.logger.debug(), this._warning = this.logger.warning(), this._error = this.logger.error(), this._fatal = this.logger.fatal();
        }
        return _createClass(LoggerAdapter, [
            {
                key: "information",
                value: function() {
                    return this._information;
                }
            },
            {
                key: "debug",
                value: function() {
                    return this._debug;
                }
            },
            {
                key: "warning",
                value: function() {
                    return this._warning;
                }
            },
            {
                key: "error",
                value: function() {
                    return this._error;
                }
            },
            {
                key: "fatal",
                value: function() {
                    return this._fatal;
                }
            },
            {
                key: "log",
                value: function(s) {
                    this.logger.log(s);
                }
            }
        ]), LoggerAdapter;
    }();
    TypeScript1.LoggerAdapter = LoggerAdapter;
    var BufferedLogger = function() {
        "use strict";
        function BufferedLogger() {
            _classCallCheck(this, BufferedLogger), this.logContents = [];
        }
        return _createClass(BufferedLogger, [
            {
                key: "information",
                value: function() {
                    return !1;
                }
            },
            {
                key: "debug",
                value: function() {
                    return !1;
                }
            },
            {
                key: "warning",
                value: function() {
                    return !1;
                }
            },
            {
                key: "error",
                value: function() {
                    return !1;
                }
            },
            {
                key: "fatal",
                value: function() {
                    return !1;
                }
            },
            {
                key: "log",
                value: function(s) {
                    this.logContents.push(s);
                }
            }
        ]), BufferedLogger;
    }();
    TypeScript1.BufferedLogger = BufferedLogger, TypeScript1.timeFunction = function(logger, funcDescription, func) {
        var start = +new Date(), result = func(), end = +new Date();
        return logger.log(funcDescription + " completed in " + (end - start) + " msec"), result;
    }, TypeScript1.stringToLiteral = function(value, _$length) {
        var result = "", addChar = function(index) {
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
        if (value.length > _$length) {
            for(var mid = _$length >> 1, i = 0; i < mid; i++)addChar(i);
            result += "(...)";
            for(var i = value.length - mid; i < value.length; i++)addChar(i);
        } else {
            _$length = value.length;
            for(var i = 0; i < _$length; i++)addChar(i);
        }
        return result;
    };
}(TypeScript || (TypeScript = {}));
