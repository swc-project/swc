//// [parserModule1.ts]
!function(CompilerDiagnostics) {
    function Alert(output) {
        CompilerDiagnostics.diagnosticWriter && CompilerDiagnostics.diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics.debug = !1, CompilerDiagnostics.diagnosticWriter = null, CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
        CompilerDiagnostics.debug && Alert(s);
    }, CompilerDiagnostics.assert = function(condition, s) {
        CompilerDiagnostics.debug && !condition && Alert(s);
    };
}(CompilerDiagnostics || (CompilerDiagnostics = {}));
export var CompilerDiagnostics;
