export var CompilerDiagnostics;
!function(CompilerDiagnostics1) {
    function Alert(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics1.debug = !1, CompilerDiagnostics1.diagnosticWriter = null, CompilerDiagnostics1.analysisPass = 0, CompilerDiagnostics1.Alert = Alert, CompilerDiagnostics1.debugPrint = function(s) {
        debug && Alert(s);
    }, CompilerDiagnostics1.assert = function(condition, s) {
        debug && (condition || Alert(s));
    };
}(CompilerDiagnostics || (CompilerDiagnostics = {
}));
