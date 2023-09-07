//// [parserModule1.ts]
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
    var debug = false;
    Object.defineProperty(CompilerDiagnostics, "debug", {
        enumerable: true,
        get: function get() {
            return debug;
        },
        set: function set(v) {
            debug = v;
        }
    });
    var diagnosticWriter = null;
    Object.defineProperty(CompilerDiagnostics, "diagnosticWriter", {
        enumerable: true,
        get: function get() {
            return diagnosticWriter;
        },
        set: function set(v) {
            diagnosticWriter = v;
        }
    });
    var analysisPass = 0;
    Object.defineProperty(CompilerDiagnostics, "analysisPass", {
        enumerable: true,
        get: function get() {
            return analysisPass;
        },
        set: function set(v) {
            analysisPass = v;
        }
    });
    CompilerDiagnostics.Alert = Alert;
    CompilerDiagnostics.debugPrint = debugPrint;
    CompilerDiagnostics.assert = assert;
})(CompilerDiagnostics || (CompilerDiagnostics = {}));
