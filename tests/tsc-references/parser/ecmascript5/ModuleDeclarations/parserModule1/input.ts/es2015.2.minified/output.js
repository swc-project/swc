var CompilerDiagnostics1;
export { CompilerDiagnostics1 as CompilerDiagnostics };
!function(CompilerDiagnostics) {
    function Alert(output) {
        diagnosticWriter && diagnosticWriter.Alert(output);
    }
    CompilerDiagnostics.debug = !1, CompilerDiagnostics.diagnosticWriter = null, CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
        debug && Alert(s);
    }, CompilerDiagnostics.assert = function(condition, s) {
        debug && (condition || Alert(s));
    };
}(CompilerDiagnostics1 || (CompilerDiagnostics1 = {
}));
