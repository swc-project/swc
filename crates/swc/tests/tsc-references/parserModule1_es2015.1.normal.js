export var CompilerDiagnostics;
(function(CompilerDiagnostics) {
    var debug = CompilerDiagnostics.debug = false;
    var diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
    var analysisPass = CompilerDiagnostics.analysisPass = 0;
    function Alert(output) {
        if (diagnosticWriter) {
            diagnosticWriter.Alert(output);
        }
    }
    CompilerDiagnostics.Alert = Alert;
    function debugPrint(s) {
        if (debug) {
            Alert(s);
        }
    }
    CompilerDiagnostics.debugPrint = debugPrint;
    function assert(condition, s) {
        if (debug) {
            if (!condition) {
                Alert(s);
            }
        }
    }
    CompilerDiagnostics.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {}));
