var CompilerDiagnostics1;
export { CompilerDiagnostics1 as CompilerDiagnostics };
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
    CompilerDiagnostics.debug = false;
    CompilerDiagnostics.diagnosticWriter = null;
    CompilerDiagnostics.analysisPass = 0;
    CompilerDiagnostics.Alert = Alert;
    CompilerDiagnostics.debugPrint = debugPrint;
    CompilerDiagnostics.assert = assert;
})(CompilerDiagnostics1 || (CompilerDiagnostics1 = {
}));
