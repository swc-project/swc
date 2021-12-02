export var CompilerDiagnostics;
(function(CompilerDiagnostics1) {
    CompilerDiagnostics1.debug = false;
    CompilerDiagnostics1.diagnosticWriter = null;
    CompilerDiagnostics1.analysisPass = 0;
    function Alert(output) {
        if (diagnosticWriter) {
            diagnosticWriter.Alert(output);
        }
    }
    CompilerDiagnostics1.Alert = Alert;
    function debugPrint(s) {
        if (debug) {
            Alert(s);
        }
    }
    CompilerDiagnostics1.debugPrint = debugPrint;
    function assert(condition, s) {
        if (debug) {
            if (!condition) {
                Alert(s);
            }
        }
    }
    CompilerDiagnostics1.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {
}));
