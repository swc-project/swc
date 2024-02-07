//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_dispose",
    "@swc/helpers/_/_using"
], function(require, exports, _dispose, _using) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "y", {
        enumerable: true,
        get: function() {
            return y;
        }
    });
    function f() {
        console.log(y, z);
    }
    try {
        var _stack = [];
        var z = _using._(_stack, {
            [Symbol.dispose] () {}
        });
        if (false) {
            var y = 1;
        }
    } catch (_) {
        var _error = _;
        var _hasError = true;
    } finally{
        _dispose._(_stack, _error, _hasError);
    }
});
