export var CompilerDiagnostics;
(function(CompilerDiagnostics) {
    var Alert = function Alert(output) {
        if (diagnosticWriter) {
            diagnosticWriter.Alert(output);
        }
    };
    var debugPrint = function debugPrint(s) {
        if (debug) {
            Alert(s);
        }
    };
    var assert = function assert(condition, s) {
        if (debug) {
            if (!condition) {
                Alert(s);
            }
        }
    };
    var debug = CompilerDiagnostics.debug = false;
    var diagnosticWriter = CompilerDiagnostics.diagnosticWriter = null;
    var analysisPass = CompilerDiagnostics.analysisPass = 0;
    CompilerDiagnostics.Alert = Alert;
    CompilerDiagnostics.debugPrint = debugPrint;
    CompilerDiagnostics.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {}));
