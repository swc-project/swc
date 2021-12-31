export var CompilerDiagnostics;
(function(CompilerDiagnostics1) {
    var debug = CompilerDiagnostics1.debug = false;
    var diagnosticWriter = CompilerDiagnostics1.diagnosticWriter = null;
    var analysisPass = CompilerDiagnostics1.analysisPass = 0;
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
