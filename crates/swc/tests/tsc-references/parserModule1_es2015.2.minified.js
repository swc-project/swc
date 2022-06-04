export var CompilerDiagnostics;
!function(CompilerDiagnostics1) {
    var debug = CompilerDiagnostics1.debug = !1, diagnosticWriter = CompilerDiagnostics1.diagnosticWriter = null;
    function Alert(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics1.analysisPass = 0, CompilerDiagnostics1.Alert = Alert, CompilerDiagnostics1.debugPrint = function(s) {
        debug && Alert(s);
    }, CompilerDiagnostics1.assert = function(condition, s) {
        debug && !condition && Alert(s);
    };
}(CompilerDiagnostics || (CompilerDiagnostics = {}));
