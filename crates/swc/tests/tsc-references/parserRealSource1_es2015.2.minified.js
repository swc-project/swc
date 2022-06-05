var TypeScript;
!function(TypeScript1) {
    !function(CompilerDiagnostics) {
        var debug = CompilerDiagnostics.debug = !1, diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
        function Alert(output) {
            diagnosticWriter && diagnosticWriter.Alert(output);
        }
        CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
            debug && Alert(s);
        }, CompilerDiagnostics.assert = function(condition, s) {
            debug && !condition && Alert(s);
        };
    }(TypeScript1.CompilerDiagnostics || (TypeScript1.CompilerDiagnostics = {})), TypeScript1.NullLogger = class {
        information() {
            return !1;
        }
        debug() {
            return !1;
        }
        warning() {
            return !1;
        }
        error() {
            return !1;
        }
        fatal() {
            return !1;
        }
        log(s) {}
    }, TypeScript1.LoggerAdapter = class {
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
            this.logger = logger, this._information = this.logger.information(), this._debug = this.logger.debug(), this._warning = this.logger.warning(), this._error = this.logger.error(), this._fatal = this.logger.fatal();
        }
    }, TypeScript1.BufferedLogger = class {
        information() {
            return !1;
        }
        debug() {
            return !1;
        }
        warning() {
            return !1;
        }
        error() {
            return !1;
        }
        fatal() {
            return !1;
        }
        log(s) {
            this.logContents.push(s);
        }
        constructor(){
            this.logContents = [];
        }
    }, TypeScript1.timeFunction = function(logger, funcDescription, func) {
        var start = +new Date(), result = func(), end = +new Date();
        return logger.log(funcDescription + " completed in " + (end - start) + " msec"), result;
    }, TypeScript1.stringToLiteral = function(value, length) {
        var result = "", addChar = (index)=>{
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
}(TypeScript || (TypeScript = {}));
