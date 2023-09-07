//// [parserModule1.ts]
var CompilerDiagnostics, Alert, debug, diagnosticWriter, analysisPass;
var CompilerDiagnostics1;
export { CompilerDiagnostics1 as CompilerDiagnostics };
CompilerDiagnostics = CompilerDiagnostics1 || (CompilerDiagnostics1 = {}), Alert = function(output) {
    diagnosticWriter && diagnosticWriter.Alert(output);
}, debug = !1, Object.defineProperty(CompilerDiagnostics, "debug", {
    enumerable: !0,
    get: function() {
        return debug;
    },
    set: function(v) {
        debug = v;
    }
}), diagnosticWriter = null, Object.defineProperty(CompilerDiagnostics, "diagnosticWriter", {
    enumerable: !0,
    get: function() {
        return diagnosticWriter;
    },
    set: function(v) {
        diagnosticWriter = v;
    }
}), analysisPass = 0, Object.defineProperty(CompilerDiagnostics, "analysisPass", {
    enumerable: !0,
    get: function() {
        return analysisPass;
    },
    set: function(v) {
        analysisPass = v;
    }
}), CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
    debug && Alert(s);
}, CompilerDiagnostics.assert = function(condition, s) {
    debug && !condition && Alert(s);
};
