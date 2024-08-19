//// [parserRealSource1.ts]
var TypeScript, TypeScript1, NullLogger, LoggerAdapter, BufferedLogger;
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
!function(CompilerDiagnostics) {
    function Alert(output) {
        CompilerDiagnostics.diagnosticWriter && CompilerDiagnostics.diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics.debug = !1, CompilerDiagnostics.diagnosticWriter = null, CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
        CompilerDiagnostics.debug && Alert(s);
    }, CompilerDiagnostics.assert = function(condition, s) {
        CompilerDiagnostics.debug && !condition && Alert(s);
    };
}((TypeScript1 = TypeScript || (TypeScript = {})).CompilerDiagnostics || (TypeScript1.CompilerDiagnostics = {})), NullLogger = /*#__PURE__*/ function() {
    function NullLogger() {
        _class_call_check(this, NullLogger);
    }
    var _proto = NullLogger.prototype;
    return _proto.information = function() {
        return !1;
    }, _proto.debug = function() {
        return !1;
    }, _proto.warning = function() {
        return !1;
    }, _proto.error = function() {
        return !1;
    }, _proto.fatal = function() {
        return !1;
    }, _proto.log = function(s) {}, NullLogger;
}(), TypeScript1.NullLogger = NullLogger, LoggerAdapter = /*#__PURE__*/ function() {
    function LoggerAdapter(logger) {
        _class_call_check(this, LoggerAdapter), this.logger = logger, this._information = this.logger.information(), this._debug = this.logger.debug(), this._warning = this.logger.warning(), this._error = this.logger.error(), this._fatal = this.logger.fatal();
    }
    var _proto = LoggerAdapter.prototype;
    return _proto.information = function() {
        return this._information;
    }, _proto.debug = function() {
        return this._debug;
    }, _proto.warning = function() {
        return this._warning;
    }, _proto.error = function() {
        return this._error;
    }, _proto.fatal = function() {
        return this._fatal;
    }, _proto.log = function(s) {
        this.logger.log(s);
    }, LoggerAdapter;
}(), TypeScript1.LoggerAdapter = LoggerAdapter, BufferedLogger = /*#__PURE__*/ function() {
    function BufferedLogger() {
        _class_call_check(this, BufferedLogger), this.logContents = [];
    }
    var _proto = BufferedLogger.prototype;
    return _proto.information = function() {
        return !1;
    }, _proto.debug = function() {
        return !1;
    }, _proto.warning = function() {
        return !1;
    }, _proto.error = function() {
        return !1;
    }, _proto.fatal = function() {
        return !1;
    }, _proto.log = function(s) {
        this.logContents.push(s);
    }, BufferedLogger;
}(), TypeScript1.BufferedLogger = BufferedLogger, TypeScript1.timeFunction = function(logger, funcDescription, func) {
    var start = +new Date(), result = func(), end = +new Date();
    return logger.log(funcDescription + " completed in " + (end - start) + " msec"), result;
}, TypeScript1.stringToLiteral = function(value, length) {
    var result = "", addChar = function(index) {
        switch(value.charCodeAt(index)){
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
    if (value.length > length) {
        for(var mid = length >> 1, i = 0; i < mid; i++)addChar(i);
        result += "(...)";
        for(var i = value.length - mid; i < value.length; i++)addChar(i);
    } else {
        length = value.length;
        for(var i = 0; i < length; i++)addChar(i);
    }
    return result;
};
