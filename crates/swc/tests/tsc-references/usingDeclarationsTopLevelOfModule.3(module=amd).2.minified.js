//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(require, exports, _dispose, _using) {
    Object.defineProperty(exports, "__esModule", {
        value: !0
    }), Object.defineProperty(exports, "y", {
        enumerable: !0,
        get: function() {
            return y;
        }
    });
    try {
        var y, _stack = [];
        _using._(_stack, {
            [Symbol.dispose] () {}
        });
    } catch (_) {
        var _error = _, _hasError = !0;
    } finally{
        _dispose._(_stack, _error, _hasError);
    }
});
