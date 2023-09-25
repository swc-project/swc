//// [parserModule1.ts]
var CompilerDiagnostics, Alert;
var CompilerDiagnostics1;
export { CompilerDiagnostics1 as CompilerDiagnostics };
CompilerDiagnostics = CompilerDiagnostics1 || (CompilerDiagnostics1 = {}), Alert = function(output) {
    CompilerDiagnostics.diagnosticWriter && CompilerDiagnostics.diagnosticWriter.Alert(output);
}, CompilerDiagnostics.debug = !1, CompilerDiagnostics.diagnosticWriter = null, CompilerDiagnostics.analysisPass = 0, CompilerDiagnostics.Alert = Alert, CompilerDiagnostics.debugPrint = function(s) {
    CompilerDiagnostics.debug && Alert(s);
}, CompilerDiagnostics.assert = function(condition, s) {
    CompilerDiagnostics.debug && !condition && Alert(s);
};
