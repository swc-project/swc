export var CompilerDiagnostics;
!function(CompilerDiagnostics) {
    var Alert = function(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }, debugPrint = function(s) {
        debug && Alert(s);
    }, assert = function(condition, s) {
        debug && !condition && Alert(s);
    }, debug = CompilerDiagnostics.debug = !1, diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
    CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = debugPrint, CompilerDiagnostics.assert = assert;
}(CompilerDiagnostics || (CompilerDiagnostics = {}));
