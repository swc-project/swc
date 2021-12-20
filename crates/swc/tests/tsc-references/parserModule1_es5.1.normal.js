export var CompilerDiagnostics;
(function(CompilerDiagnostics1) {
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
    CompilerDiagnostics1.debug = false;
    CompilerDiagnostics1.diagnosticWriter = null;
    CompilerDiagnostics1.analysisPass = 0;
    CompilerDiagnostics1.Alert = Alert;
    CompilerDiagnostics1.debugPrint = debugPrint;
    CompilerDiagnostics1.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {
}));
