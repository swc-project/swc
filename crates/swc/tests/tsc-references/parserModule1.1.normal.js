//// [parserModule1.ts]
(function(CompilerDiagnostics) {
    CompilerDiagnostics.debug = false;
    CompilerDiagnostics.diagnosticWriter = null;
    CompilerDiagnostics.analysisPass = 0;
    function Alert(output) {
        if (CompilerDiagnostics.diagnosticWriter) {
            CompilerDiagnostics.diagnosticWriter.Alert(output);
        }
    }
    CompilerDiagnostics.Alert = Alert;
    function debugPrint(s) {
        if (CompilerDiagnostics.debug) {
            Alert(s);
        }
    }
    CompilerDiagnostics.debugPrint = debugPrint;
    function assert(condition, s) {
        if (CompilerDiagnostics.debug) {
            if (!condition) {
                Alert(s);
            }
        }
    }
    CompilerDiagnostics.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {}));
export var CompilerDiagnostics;
