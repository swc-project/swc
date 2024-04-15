//// [usingDeclarationsTopLevelOfModule.3.ts]
define([
    "require",
    "exports",
    "@swc/helpers/_/_using_ctx"
], function(require, exports, _using_ctx) {
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
        var _usingCtx = _using_ctx._();
        var z = _usingCtx.u({
            [Symbol.dispose] () {}
        });
        if (false) {
            var y = 1;
        }
    } catch (_) {
        _usingCtx.e = _;
    } finally{
        _usingCtx.d();
    }
});
