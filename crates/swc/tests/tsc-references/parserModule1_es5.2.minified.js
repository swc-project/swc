export var CompilerDiagnostics;
!function(CompilerDiagnostics) {
    var Alert = function(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }, debug = CompilerDiagnostics.debug = !1, diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
    CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
        debug && Alert(s);
    }, CompilerDiagnostics.assert = function(condition, s) {
        debug && !condition && Alert(s);
    };
}(CompilerDiagnostics || (CompilerDiagnostics = {}));
