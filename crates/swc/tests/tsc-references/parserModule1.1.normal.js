//// [parserModule1.ts]
export var CompilerDiagnostics;
(function(CompilerDiagnostics) {
    var Alert = function Alert(output) {
        if (CompilerDiagnostics.diagnosticWriter) {
            CompilerDiagnostics.diagnosticWriter.Alert(output);
        }
    };
    var debugPrint = function debugPrint(s) {
        if (CompilerDiagnostics.debug) {
            Alert(s);
        }
    };
    var assert = function assert(condition, s) {
        if (CompilerDiagnostics.debug) {
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
})(CompilerDiagnostics || (CompilerDiagnostics = {}));
