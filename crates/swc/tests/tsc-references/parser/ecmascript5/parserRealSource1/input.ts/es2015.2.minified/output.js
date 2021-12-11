var TypeScript, TypeScript1;
(function(CompilerDiagnostics) {
    function Alert(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics.debug = !1, CompilerDiagnostics.diagnosticWriter = null, CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
        debug && Alert(s);
    }, CompilerDiagnostics.assert = function(condition, s) {
        debug && (condition || Alert(s));
    };
})((TypeScript1 = TypeScript || (TypeScript = {
})).CompilerDiagnostics || (TypeScript1.CompilerDiagnostics = {
})), TypeScript1.NullLogger = class {
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
    }
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
